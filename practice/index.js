import express from 'express'

const app = express();

const PORT = process.env.PORT || 3000


app.get("/:id", (req, res)=> {
    const id = req.params.id
    console.log(id);
    
    res.send(`Hello World ${id}`)
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})