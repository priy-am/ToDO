import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Popup from "./components/Popup";
import { v4 as uuidv4 } from 'uuid';
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";


function App() {
  const [todo, setTodo] = useState();
  const [todos, setTodos] = useState([]);
  const [popup, setPopup] = useState({show: false, id: null});
  const [showfinished, setshowfinished] = useState(true)

  useEffect(() => {
    let todoString = localStorage.getItem("todos")
    if(todoString){
      let todos = JSON.parse(localStorage.getItem("todos"))
      setTodos(todos)
    }
  }, [])
  

  const saveToLS = (params) => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }

  const togglefinished = (e) => {
    setshowfinished(!showfinished)
  }
  

  const handleEdit = (e, id) => {
    let t = todos.filter(item =>{
      return item.id == id
    })
    setTodo(t[0].todo)
    let newTodos = todos.filter(item => {
      return item.id !== id
    })
    setTodos(newTodos);
    saveToLS()
  };

  const handleDelete = (e, id) => {
    setPopup({show: true, id: id});
    console.log(`we click on delte handle ${popup}`)
  };

  const handleDeleteTrue = () => {
    if (popup.show && popup.id) {
      let filteredData = todos.filter(item =>{ return item.id !== popup.id});
      setTodos(filteredData);
      setPopup({show: false,id: null});
      console.log(`we click on confirm to deletetrue chal raha hai ${popup}`)
    }
    saveToLS()
  };

  const handleDeleteFalse = () => {
    setPopup({show: false,id: null});
  };

  const handleAdd = () => {
    setTodos([...todos, { id: uuidv4(), todo, isCompleted: false }]);
    setTodo("");
    saveToLS();
  };

  const handleChange = (e) => {
    setTodo(e.target.value);
  };

  const handleCheckbox = (e) => {
    let id = e.target.name;
    let index = todos.findIndex(item => {
      return item.id === id
    })
    let newTodos = [...todos];
    newTodos[index].isCompleted = !newTodos[index].isCompleted;
    setTodos(newTodos);
    saveToLS()
  }


  return (
    <>
      <Navbar />
      <div className="container mx-auto bg-blue-100 rounded-xl p-7 my-5 mt-12 w-3/4 min-h-[70vh]">
        <div className="text-center text-xl font-bold mb-7">Manage your todos at one place </div>
        <div className="addTodo flex gap-8 items-center">
          <h2 className="text-lg font-bold">Add a Todo</h2>
          <input onChange={handleChange} value={todo} type="text" className="w-80" />
          <button onClick={handleAdd}  className="bg-blue-950 text-white p-2 rounded-lg disabled:bg-gray-800 hover:font-bold w-16"> Add </button>
        </div>

        <input type="checkbox" onChange={togglefinished} checked={showfinished}  />Show finished

        <h2 className="text-xl font-bold">Your Todos </h2>
        <div className="todos">
          {todos.length === 0 && <div className="m-5">No todo display</div>}
          {todos.map(item => {
            return (showfinished || !item.isCompleted) && <div key={item.id} className="todo flex w-1/4 justify-between my-4">
              <div className="flex gap-4">
                <input onChange={handleCheckbox} type="checkbox" checked={item.isCompleted} name={item.id} id="" />
                <div className={item.isCompleted ? "line-through w-36" : "w-36"} >{item.todo}</div>
              </div>
              <div className="buttons flex">
                <button onClick={(e) => handleEdit(e, item.id)} className="edit mx-3 hover:bg-[#7da5d2c7] rounded-full p-1 w-12 flex justify-center focus:bg-[#919395bd]">
                  <MdEdit size={"28px"}/>
                </button>

                <button onClick={(e) => { handleDelete(e, item.id) }} className="delete mx-3 hover:bg-[#7da5d2c7] rounded-full p-1 w-12 flex justify-center focus:bg-[#919395bd]">
                  <MdDelete size={"28px"} />
                </button>
              </div>
            </div>;
          })}
          {popup.show && <Popup handleDeleteTrue={handleDeleteTrue} handleDeleteFalse={handleDeleteFalse} />}
        </div>
      </div>
    </>
  );
}

export default App;
