import type { WorkerResponse, WorkerRunRequest } from '../types';
import { APP_VERSION, PYODIDE_VERSION } from '../data/catalog';

type PyodideApi = { loadPackage:(packages:string[])=>Promise<void>; globals:{set:(name:string,value:unknown)=>void}; runPythonAsync:(code:string)=>Promise<unknown>; };
let pyodidePromise: Promise<PyodideApi> | null = null;

async function getPyodide(progress:(message:string)=>void): Promise<PyodideApi> {
  if (!pyodidePromise) pyodidePromise = (async () => {
    progress(`Loading Pyodide ${PYODIDE_VERSION}…`);
    const module = await import(/* @vite-ignore */ `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/pyodide.mjs`) as {loadPyodide:(options:{indexURL:string})=>Promise<PyodideApi>};
    const runtime = await module.loadPyodide({ indexURL:`https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/` });
    progress('Loading NumPy, pandas, and scikit-learn…');
    await runtime.loadPackage(['numpy','pandas','scikit-learn']);
    return runtime;
  })();
  return pyodidePromise;
}

const PYTHON = String.raw`
import io, json, platform, sys
import numpy as np
import pandas as pd
import sklearn
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix, mean_absolute_error, mean_squared_error, r2_score

cfg = json.loads(config_json)
df = pd.read_csv(io.StringIO(csv_text))
target = cfg['target']
if target not in df.columns:
    raise ValueError(f"Target column '{target}' is not present in the dataset")
X = df.drop(columns=[target])
y = df[target]
num_cols = list(X.select_dtypes(include=[np.number]).columns)
cat_cols = [c for c in X.columns if c not in num_cols]
preprocessor = ColumnTransformer([
    ('numeric', Pipeline([('imputer', SimpleImputer(strategy='median')), ('scaler', StandardScaler())]), num_cols),
    ('categorical', Pipeline([('imputer', SimpleImputer(strategy='most_frequent')), ('encoder', OneHotEncoder(handle_unknown='ignore'))]), cat_cols),
])
seed = int(cfg['seed'])
test_size = float(cfg['testSize'])
if cfg['task'] == 'classification':
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size, random_state=seed, stratify=y)
    candidates = ['logistic_regression','random_forest_classifier'] if cfg['strategy']=='automl' else [cfg['modelKey']]
else:
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size, random_state=seed)
    candidates = ['linear_regression','random_forest_regressor'] if cfg['strategy']=='automl' else [cfg['modelKey']]

def create_model(key):
    p = cfg.get('parameters', {})
    if key == 'logistic_regression': return LogisticRegression(C=float(p.get('C',1.0)), max_iter=int(p.get('maxIter',600)), random_state=seed)
    if key == 'random_forest_classifier': return RandomForestClassifier(n_estimators=int(p.get('nEstimators',180)), max_depth=int(p.get('maxDepth',8)), min_samples_leaf=int(p.get('minSamplesLeaf',2)), random_state=seed, n_jobs=1)
    if key == 'linear_regression': return LinearRegression()
    if key == 'random_forest_regressor': return RandomForestRegressor(n_estimators=int(p.get('nEstimators',180)), max_depth=int(p.get('maxDepth',10)), min_samples_leaf=int(p.get('minSamplesLeaf',2)), random_state=seed, n_jobs=1)
    raise ValueError(f'Unsupported model: {key}')

labels = {'logistic_regression':'Logistic Regression','random_forest_classifier':'Random Forest Classifier','linear_regression':'Linear Regression','random_forest_regressor':'Random Forest Regressor'}
results=[]
for key in candidates:
    pipe = Pipeline([('preprocessor', preprocessor), ('model', create_model(key))])
    pipe.fit(X_train, y_train)
    prediction = pipe.predict(X_test)
    if cfg['task']=='classification':
        probability = pipe.predict_proba(X_test)[:,1] if hasattr(pipe,'predict_proba') and len(np.unique(y))==2 else None
        metrics = {'accuracy':accuracy_score(y_test,prediction),'precision':precision_score(y_test,prediction,average='binary',zero_division=0),'recall':recall_score(y_test,prediction,average='binary',zero_division=0),'f1':f1_score(y_test,prediction,average='binary',zero_division=0),'roc_auc':roc_auc_score(y_test,probability) if probability is not None else None}
        matrix = confusion_matrix(y_test,prediction).tolist()
    else:
        metrics = {'mae':mean_absolute_error(y_test,prediction),'rmse':float(np.sqrt(mean_squared_error(y_test,prediction))),'r2':r2_score(y_test,prediction)}
        matrix = None
    top=[]
    try:
        names = pipe.named_steps['preprocessor'].get_feature_names_out()
        model = pipe.named_steps['model']
        values = model.feature_importances_ if hasattr(model,'feature_importances_') else np.abs(np.ravel(model.coef_)) if hasattr(model,'coef_') else []
        order = np.argsort(values)[::-1][:8]
        top = [{'name':str(names[i]).replace('numeric__','').replace('categorical__',''),'importance':float(values[i])} for i in order]
    except Exception:
        top=[]
    results.append({'modelKey':key,'label':labels[key],'metrics':{k:(None if v is None else float(v)) for k,v in metrics.items()},'confusionMatrix':matrix,'topFeatures':top})

winner = max(results, key=lambda r: r['metrics'].get('f1', -1) if cfg['task']=='classification' else r['metrics'].get('r2', -999))['modelKey']
payload = {'results':results,'winner':winner,'runtime':{'mode':'full-browser','pyodide':'${PYODIDE_VERSION}','python':platform.python_version(),'scikitLearn':sklearn.__version__,'pandas':pd.__version__,'numpy':np.__version__,'app':'${APP_VERSION}'}}
json.dumps(payload)
`;

self.onmessage = async (event: MessageEvent<WorkerRunRequest>) => {
  const request = event.data;
  const send = (data:WorkerResponse) => self.postMessage(data);
  try {
    const runtime = await getPyodide((message)=>send({id:request.id,type:'progress',message}));
    send({id:request.id,type:'progress',message:'Training deterministic pipeline…'});
    runtime.globals.set('csv_text',request.csvText); runtime.globals.set('config_json',JSON.stringify(request.config));
    const output = await runtime.runPythonAsync(PYTHON);
    send({id:request.id,type:'result',payload:JSON.parse(String(output))});
  } catch (error) { send({id:request.id,type:'error',message:error instanceof Error ? error.message : String(error)}); }
};
