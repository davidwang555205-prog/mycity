import { CITIES } from "../src/data/cities";
import { matchCities } from "../src/lib/engine";
import { DIMENSIONS, type ClimatePreference, type LifeProfile } from "../src/domain/types";
const mulberry32=(seed:number)=>()=>{let t=seed+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296};
const random=mulberry32(20260809), tally=()=>Object.fromEntries(CITIES.map(c=>[c.name,0])) as Record<string,number>;
const result={destiny:tally(),career:tally(),comfort:tally(),least:tally()};
for(let i=0;i<10000;i++){const climate={warm:random()*100,cool:random()*100,dry:random()*100,humid:random()*100,sunny:random()*100} as ClimatePreference;const p={...Object.fromEntries(DIMENSIONS.map(d=>[d,Math.round(random()*100)])),climate} as LifeProfile;const ranks=matchCities(p);result.destiny[ranks.destiny[0].city.name]++;result.career[ranks.career[0].city.name]++;result.comfort[ranks.comfort[0].city.name]++;result.least[ranks.least.city.name]++;}
for(const [kind,counts] of Object.entries(result)){console.log(`\n${kind}`);for(const [name,count] of Object.entries(counts).sort((a,b)=>b[1]-a[1]))console.log(`${name}\t${(count/100).toFixed(2)}%`);}
