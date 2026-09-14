const todos = []
let unique = 0

export function showTodo(req, res){

    res.json({
        todos
    })
}
export function addTodo(req, res) {

    if(!req.body.title)return res.status(400).json({ message:"enter todo"})

    if(!req.body.title === "string")return res.status(400).json({message:"Title is required"})

    if(req.body.title.trim() === "")return res.status(400).json({message:"Enter text as todo desc"})

    const newTodo = {
        _id: ++unique,
        title: req.body.title,
    }
    todos.push(newTodo)

    res.status(201).json({
        message: "Your todo created successfully"
    })
    
}
