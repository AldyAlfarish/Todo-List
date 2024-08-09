const express = require("express")
const cors = require("cors")
const port = 3000;
const app = express()
const { Task } = require("./models/index");
const { where } = require("sequelize");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get("/", (req, res) => res.send("Express on Vercel"));

app.get('/api/task',async (req, res) => {
    const data = await Task.findAll();
    
    res.status(200).json(data);
})

app.post('/api/store-data', async (req, res) =>{
    let {task_name, description, due_date} = req.body

    try {
        await Task.create({task_name, description, due_date, status:"Pending"})
        res.status(200).json("Berhasil")
    } catch (error) {
        res.status(400).json(error)
    }
})

app.put('/api/posts/:id', async (req, res) => {
    let {task_name, description, due_date} = req.body
    let {id} = req.params
    try {
        await Task.update({
            task_name,
            description,
            due_date
        }, {where:{id}})
        res.status(200).json("Berhasil")
    } catch (error) {
        res.status(400).json(error)
    }
})

app.put('/api/completed/:id', async (req, res) => {
    let {id} = req.params
    try {
        await Task.update({
            status:"Completed"
        }, {where:{id}})
        res.status(200).json("Berhasil")
    } catch (error) {
        res.status(400).json(error)
    }
})

app.delete('/api/posts/:id', async (req, res) => {
    let {id} = req.params
    try {
        await Task.destroy(
         {where:{id}})
        res.status(200).json("Berhasil")
    } catch (error) {
        res.status(400).json(error)
    }
})

app.listen(port, () => {
    console.log("Hello World");
});

module.exports = app;
