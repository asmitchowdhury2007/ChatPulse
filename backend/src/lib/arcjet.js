import dotenv from "dotenv";
dotenv.config();
import arcjet, { shield, detectBot, slidingWindow} from "@arcjet/node";
import { isSpoofedBot } from "@arcjet/inspect";

const aj = arcjet({
 
  key: process.env.ARCJET_KEY,
  rules: [
    
    shield({ mode: "LIVE" }),
   
    detectBot({
      mode: "LIVE", 
      
      allow: [
        "CATEGORY:SEARCH_ENGINE", 
        
      ],
    }),
   
    slidingWindow({
      mode: "LIVE",
      interval : "10m",
      max :10,
     
    }),
  ],
});

export default aj