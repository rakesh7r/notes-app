import { Router } from "express";

const noteRouter = Router();

noteRouter.get("/", (req, res) => {
    res.json({ message: "Hello World!" });
});

noteRouter.post("/", (req, res) => {
    res.json({ message: "Hello World!" });    
});

noteRouter.put("/", (req, res) => {
    res.json({ message: "Hello World!" });    
});

noteRouter.delete("/", (req, res) => {
    res.json({ message: "Hello World!" });    
});

export default noteRouter;
