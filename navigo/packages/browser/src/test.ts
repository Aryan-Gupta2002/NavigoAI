import { BrowserSession } from "./index.js";
let bs = new BrowserSession();
await bs.start();
await bs.navigate("https://www.youtube.com/");
await new Promise((resolve) => setTimeout(resolve, 5000));
await bs.close();
