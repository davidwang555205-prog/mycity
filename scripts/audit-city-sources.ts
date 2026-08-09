import { CITIES } from "../src/data/cities";
const total=CITIES.length; const fields=CITIES.flatMap(city=>city.sources.map(source=>({city:city.name,...source})));
const objective=fields.filter(x=>x.type==="objective"), derived=fields.filter(x=>x.type==="derived"), editorial=fields.filter(x=>x.type==="editorial");
const pct=(items:typeof fields)=>`${(items.filter(x=>x.sourceUrl).length/items.length*100).toFixed(1)}%`;
console.log(`cities\t${total}`);console.log(`objective url coverage\t${pct(objective)} (${objective.length})`);console.log(`derived url coverage\t${pct(derived)} (${derived.length})`);console.log(`editorial fields\t${editorial.length}`);console.log(`missing sourceUrl\t${fields.filter(x=>x.type!=="editorial"&&!x.sourceUrl).length}`);console.log(`confidence < 0.5\t${CITIES.flatMap(city=>Object.entries(city.confidence).filter(([,v])=>v<.5).map(([dimension])=>`${city.name}:${dimension}`)).length}`);
