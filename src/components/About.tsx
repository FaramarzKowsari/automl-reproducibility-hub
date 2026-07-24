import { BookOpen, ExternalLink, GraduationCap, Orbit, ShieldCheck } from 'lucide-react';

const links=[
 ['ORCID','https://orcid.org/0000-0003-1692-0453',Orbit],
 ['Google Scholar','https://scholar.google.com/citations?user=G7tP5WMAAAAJ&hl=en',GraduationCap],
 ['GitHub','https://github.com/FaramarzKowsari',ExternalLink],
 ['LinkedIn','https://www.linkedin.com/in/faramarzkowsari',ExternalLink],
 ['Google Books','https://play.google.com/store/search?q=Faramarz_Kowsari&c=books',BookOpen]
] as const;

export function About(){
 return <div className="about-layout">
  <section className="glass-card author-card">
   <img src="https://avatars.githubusercontent.com/u/105053743?v=4" alt="Faramarz Kowsari"/>
   <div>
    <span className="eyebrow">Author and principal developer</span>
    <h1>Faramarz Kowsari</h1>
    <p>Faramarz Kowsari is an author, Software Engineer and AI researcher based in Istanbul. Focusing on the intersection of technology, education, and personal growth, he has published over 80 digital titles on international platforms. His areas of expertise span Artificial Intelligence, prompt engineering, modern trading strategies, classical literature, and mindfulness. He also develops web-based educational tools and specialized instructional content.</p>
    <div className="official-links">
     {links.map(([label,url,Icon])=><a href={url} target="_blank" rel="noreferrer" key={label}><Icon/><span>{label}</span><ExternalLink size={14}/></a>)}
    </div>
   </div>
  </section>
  <section className="glass-card philosophy">
   <ShieldCheck/>
   <div>
    <span className="eyebrow">Scientific position</span>
    <h2>Reproducibility is a design constraint</h2>
    <p>This project treats seed, dataset version, cryptographic fingerprint, preprocessing, parameters, metrics, and runtime versions as one indivisible experimental contract. It does not claim that matching a seed alone guarantees bit-for-bit equivalence across every browser or numerical backend.</p>
   </div>
  </section>
 </div>
}
