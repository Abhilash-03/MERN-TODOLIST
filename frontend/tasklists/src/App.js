import { Route, Routes, useNavigate} from "react-router-dom";
import Navbar from "./components/Navbar";
import Todo from "./components/Todo";
import Register from "./components/Register";
import Login from "./components/Login";
import Item from "./components/Item";
import {useEffect, useState} from 'react'
import api from '../src/axios/axios'
import EditTask from "./components/EditTask";

function App() {
  const [task, setTask] = useState('');
  const [taskDetails, setTaskDetails] = useState([]);
  const token = localStorage.getItem('token');
  const [editTask, setEditTask] = useState('');
  const [checked, setChecked] = useState(false);
  const [allTasks, setAllTasks] = useState([]);
  const [msg, setMsg] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const showTask = async() => {
        setIsLoading(true);
    try {
      const response = await api.get('/todos', {
        headers:{
         Authorization: `Bearer ${token}`
        }
      })
      const data = response.data.getTodo;
      setAllTasks([...data]);
      setIsLoading(false);

    } catch (error) {
       console.log(error);
       setIsLoading(false);
       setErrMsg(`${error.response.statusText}(${error.response.status})`);
       if(error.response.status === 401){
        setTimeout(() => {
          navigate('/login')
        }, 3000);
       }
       setTimeout(() => {
        setErrMsg('');
       }, 2500);


    }
 }

 useEffect(()=> {
  !localStorage.getItem('token') ? <h5>Please Sign-up or Login to use this app.</h5>
   : showTask();

   // eslint-disable-next-line
 }, [])


  const handleChange = async(e) => {
    e.preventDefault();
      let newTask = {
          name: task
      }
    
      try{
        const response = await api.post('/todos', newTask, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log(response.data);
        setTask('');
        setMsg(response.data.msg)
        setTimeout(()=> {
          setMsg('');
        }, 2000)
        showTask();
      } catch(error){
        console.log(error);
        if(error.response.status === 401){
          setErrMsg("You're not logged-in. Please login or register.");
        }

        setTimeout(() => {
          setErrMsg('');
          navigate('/login')
        }, 4000);
      }
     
  }




  const handleDelete = async(id) => {
    try {
      const response = await api.delete(`/todos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }

      })

      const data = response.data;
      setMsg(data.msg);      
      showTask();
      setTimeout(() => {
        setMsg('');
      navigate('/')
       
      }, 1500);
    } catch (error) {
      console.log(error);
    }
  }

  const handleUpdate = async(id) => {
    const edit_task = {
      name: editTask,
      completed: checked
    }
    try {
     const response = await api.patch(`/todos/${id}`, edit_task, {
      headers: {
        Authorization: `Bearer ${token}`
      }
     })

     const data = response.data;
     setMsg(data.msg);

     showTask();
     setTimeout(() => {
      setMsg('');
     navigate('/')
      
     }, 1500);
      
    } catch (error) {
      console.log(error);
    }
  }

  const handleGetTask = async(id) => {
    try {
      const response = await api.get(`/todos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = response.data.todo;
      setTaskDetails([data]);
      setEditTask(data.name);
      setChecked(data.completed);
    } catch (error) {
      console.log(error);
    }
  }

  const handleLogout = ()=>{
    try{
      localStorage.removeItem('token');
      window.location.reload();
        navigate('/login')
    } catch(error){
      console.log(error);
    }
  }

  return (
    <main className="app">
      <Navbar handleLogout={handleLogout}/>
        <Routes>
          <Route index element={<Todo
             task={task}
             setTask={setTask}
             allTasks={allTasks}
             handleChange={handleChange}
             handleGetTask = {handleGetTask}
             msg={msg}
             errMsg={errMsg}
             isLoading={isLoading}
          />} />
          <Route exact path="/tasks/:id" element={<Item taskDetails={taskDetails} handleDelete={handleDelete}  msg={msg} />} />
          <Route exact path="/todos/:id" element={<EditTask editTask={editTask} setEditTask={setEditTask} taskDetails={taskDetails} handleUpdate={handleUpdate} completed={checked} setCompleted={setChecked} msg={msg} />}/>
          <Route path="/register" element={<Register/> } />
          <Route path="/login" element={<Login/> } />
        </Routes>
      
    </main>
  );
}

export default App;
