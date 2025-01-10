import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { TodoistApi } from "@doist/todoist-api-typescript/dist";
import { Descriptions } from "antd";

const api = new TodoistApi("ec9761859e72ddd389c611948b9e63f46e8f5f61");


export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async ()=> {
    const tasks = await api.getTasks();
    return tasks;
})

export const addTask = createAsyncThunk("tasks/addTask", async(taskData)=> {
    const task = await api.addTask(taskData)
    return task;
})

export const editTask = createAsyncThunk("tasks/editTask", async({taskId, updatedData})=> {
    const updatedTask = await api.updateTask(taskId, updatedData);
    return {taskId, updatedTask};
})

export const deleteTask = createAsyncThunk("tasks/deleteTask", async(taskId)=> {
    await api.deleteTask(taskId);
    return taskId;
})


const initialState = {

    tasks : [],
    status : "idle",
    error : null,
}

const taskSlice = createSlice({
    name : "tasks",
    initialState,

    extraReducers : (builder) => {
        builder
        .addCase(fetchTasks.pending, (state)=> {
            state.status = "loading";
        })
        .addCase(fetchTasks.fulfilled, (state, action)=> {
            state.status = "success";
            state.tasks= action.payload;
        })
        .addCase(fetchTasks.rejected, (state)=> {
            state.status = "failed";
            state.error = action.error.message;
        })
        .addCase(addTask.fulfilled, (state,action)=> {
            state.tasks.push(action.payload);
        })
        .addCase(editTask.fulfilled, (state,action)=> {
            const {taskId, updatedTask} = action.payload;
            state.tasks=state.tasks.map((task)=>task.id==taskId?updatedTask:task)
        })
        .addCase(deleteTask.fulfilled, (state,action)=> {
            state.tasks = state.tasks.filter((task)=>  task.id !== action.payload);
        })
    }
})

// export const {openTaskModal, closeTaskModal}  = taskSlice.actions

export default taskSlice.reducer;