import type { WorkerResponse, WorkerRunRequest } from '../types';
let worker: Worker | null = null;
export function runInPyodide(request: WorkerRunRequest, onProgress:(message:string)=>void): Promise<NonNullable<WorkerResponse['payload']>> {
  if (!worker) worker = new Worker(new URL('../workers/pyodide.worker.ts', import.meta.url), { type:'module' });
  return new Promise((resolve,reject) => {
    const handler = (event:MessageEvent<WorkerResponse>) => {
      if (event.data.id !== request.id) return;
      if (event.data.type === 'progress') onProgress(event.data.message ?? 'Working…');
      if (event.data.type === 'error') { worker?.removeEventListener('message',handler); reject(new Error(event.data.message)); }
      if (event.data.type === 'result') { worker?.removeEventListener('message',handler); resolve(event.data.payload!); }
    };
    worker!.addEventListener('message',handler); worker!.postMessage(request);
  });
}
