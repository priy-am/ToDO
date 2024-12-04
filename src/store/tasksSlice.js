import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    tasks : [],
    filter: 'all'
};

export const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers:{
        addTask:(state, actions)=>{
            state.tasks.push({
                id: Date.now(),
                ...actions.payload,
                completed: false,
            })
        },

        editTask:(state, actions)=>{
            const { id, update } = actions.payload;
            const task = state.tasks.find(task => task.id === id);
            if(task) Object.assign(task, update);
            state.tasks = state.tasks.filter(task=> task.id != id)
        },

        deleteTask:(state, actions)=>{
            state.tasks = state.tasks.filter(task => task.id != actions.payload )

        },
        
        toggleComplete:(state, actions)=>{
            const task = state.tasks.find(task=> task.id === actions.payload);
            if(task) task.completed = !task.completed;
        },

        setFilter:(state, action)=>{
            state.filter = action.payload;
        },

        reorderTasks: (state, action) => {
            state.tasks = action.payload; 
          },

    }
})

export const { addTask, editTask, deleteTask, toggleComplete, setFilter, reorderTasks  } = tasksSlice.actions;

export default tasksSlice.reducer

