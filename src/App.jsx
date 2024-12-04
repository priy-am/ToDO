import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Popup from "./components/Popup";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import {
  addTask,
  deleteTask,
  editTask,
  reorderTasks,
  setFilter,
  toggleComplete,
} from "./store/tasksSlice";
import SearchIcon from '@mui/icons-material/Search';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function App() {
  const dispatch = useDispatch();
  const { tasks, filter } = useSelector((state) => state.tasks);

  const [todo, setTodo] = useState();
  const [dueDate, setDueDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [popup, setPopup] = useState({ show: false, id: null });

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      dispatch({
        type: "tasks/replaceTasks",
        payload: JSON.parse(storedTasks),
      });
    }
  }, [dispatch]);

  const saveToLocalStorage = (tasks) => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  const handleEdit = (e, id) => {
    const taskToEdit = tasks.find((item) => item.id === id);
    if (taskToEdit) {
      setTodo(taskToEdit.todo);
      setDueDate(taskToEdit.dueDate);
    }

    dispatch(
      editTask({
        id: id,
        updates: { todo: taskToEdit.todo, dueDate: taskToEdit.dueDate },
      })
    );
    saveToLocalStorage(tasks);
  };

  const handleDelete = (e, id) => {
    setPopup({ show: true, id: id });
  };

  const handleDeleteTrue = () => {
    if (popup.show && popup.id) {
      const updatedTasks = tasks.filter((task) => task.id !== popup.id);
      dispatch(deleteTask(popup.id));
      saveToLocalStorage(updatedTasks);
      setPopup({ show: false, id: null });
    }
  };

  const handleDeleteFalse = () => {
    setPopup({ show: false, id: null });
  };

  const handleSubmit = () => {
    if (todo && dueDate) {
      const newTask = {id: Date.now().toString(), todo, dueDate, completed: false };
      dispatch(addTask({ todo, dueDate }));
      saveToLocalStorage([...tasks, newTask]);
      setTodo("");
      setDueDate("");
    } else {
      alert("Task and Due Date are required");
    }
  };

  const handleChange = (e) => {
    setTodo(e.target.value);
  };

  const handleCheckbox = (id) => {
    dispatch(toggleComplete(id));
    saveToLocalStorage(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleFilterChange = (e) => {
    const selectedFilter = e.target.value;
    dispatch(setFilter(selectedFilter));
  };

  const handleDragEnd = (result) => {
    const { source, destination } = result;

    // If dropped outside the list
    if (!destination) return;

    // Reorder the tasks
    const reorderedTasks = [...tasks];
    const [movedTask] = reorderedTasks.splice(source.index, 1);
    reorderedTasks.splice(destination.index, 0, movedTask);

    dispatch(reorderTasks(reorderedTasks));
    saveToLocalStorage(reorderedTasks);
  };

  const filteredTasks = tasks
    .filter((task) => {
      if (filter === "completed") return task.completed;
      if (filter === "pending") return !task.completed;
      if (filter === "overdue")
        return new Date(task.dueDate) < new Date() && !task.completed;
      return true; // "all" filter
    })
    .filter(
      (task) => task.todo.toLowerCase().includes(searchQuery) // Search filter
    );

  return (
    <>
      <Navbar />
      <div className="container mx-auto bg-blue-100 rounded-xl p-7 my-5 mt-12 md:w-3/4 w-[98%] min-h-[70vh]">
        <div className="text-center text-xl font-bold mb-7">
          <span> Manage your Task at one place</span>
        </div>
        <div className="addTodo flex flex-col md:flex-row gap-4 md:gap-8 items-center">
          <h2 className="text-lg font-semibold">Add a Todo</h2>
          <TextField
            id="outlined-basic"
            label="Task"
            variant="outlined"
            onChange={handleChange}
            value={todo}
            className="md:w-80 w-full"
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className=" bg-transparent border border-gray-500 p-2 rounded-lg py-3"
          />
          <Button
            variant="contained"
            onClick={handleSubmit}
            className="bg-blue-950 text-white p-2 rounded-lg disabled:bg-gray-800 hover:font-bold w-20"
          >
            Add
          </Button>
        </div>

        {/* search */}
        <div className="my-4 relative">
          <TextField
            id="search-tasks"
            label="Search Tasks"
            variant="outlined"
            onChange={handleSearch}
            value={searchQuery}
            className="w-full"
          />
          <div className="absolute  right-4 bottom-4 "> <SearchIcon /> </div>

        </div>

        <h2 className="text-xl font-bold mb-7">Your Todos </h2>

        {/* filter */}
        <div>
          <FormControl className="w-32">
            <InputLabel id="demo-simple-select-label">Filter</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={filter}
              label="Filter"
              onChange={handleFilterChange}
            >
              <MenuItem value={"all"}>all</MenuItem>
              <MenuItem value={"completed"}>completed</MenuItem>
              <MenuItem value={"pending"}>pending</MenuItem>
              <MenuItem value={"overdue"}>overdue</MenuItem>
            </Select>
          </FormControl>
        </div>

        <div className="todos">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="tasks">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="p-5  rounded-lg shadow-md"
                >
                  {filteredTasks.length === 0 && (
                    <div className="m-5 text-gray-500">No todos to display</div>
                  )}

                  {filteredTasks.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="todo flex justify-between items-center   p-4 my-4 rounded shadow-md"
                        >
                          <div className="flex items-center gap-4">
                            <input
                              onChange={() => handleCheckbox(item.id)}
                              type="checkbox"
                              checked={item.completed}
                              id={item.id}
                              className="checkbox w-5 h-5 cursor-pointer"
                            />
                            <div
                              className={`w-36 md:w-72 ${item.completed ? "line-through text-gray-400" : ""
                                }`}
                            >
                              {item.todo}
                            </div>
                            <div className="text-gray-600 text-sm">{item.dueDate}</div>
                          </div>

                          <div className="buttons flex">
                            <button
                              onClick={(e) => handleEdit(e, item.id)}
                              className="edit mx-3 hover:bg-blue-200 rounded-full p-1 w-12 flex justify-center focus:bg-blue-300"
                            >
                              <MdEdit size="28px" />
                            </button>

                            <button
                              onClick={(e) => {
                                handleDelete(e, item.id);
                              }}
                              className="delete mx-3 hover:bg-red-200 rounded-full p-1 w-12 flex justify-center focus:bg-red-300"
                            >
                              <MdDelete size="28px" />
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>


          {popup.show && (
            <Popup
              handleDeleteTrue={handleDeleteTrue}
              handleDeleteFalse={handleDeleteFalse}
            />
          )}
        </div>
      </div >
    </>
  );
}

export default App;
