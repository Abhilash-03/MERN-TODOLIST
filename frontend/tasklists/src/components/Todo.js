import TaskList from './TaskList';

function Todo({ task, setTask, allTasks, handleChange, handleGetTask, msg}) {

  return (
    <>
    <form className="todoBox d-flex flex-column justify-content-center align-items-center  m-auto mt-4" onSubmit={handleChange}>
      <h1>Todo List</h1>
        <div className="inputField d-flex m-3 w-100">
            <input type="text"
              placeholder="Enter your task"
              className='form-control'
              required
              value={task}
              onChange={(e)=> setTask(e.target.value)}
            />

          <button className='addBtn btn btn-dark m-2'><i className='fa-solid fa-add'></i></button>

        </div>
          <h6 className='text-success fw-bold'>{msg}</h6>
    </form>
 
    <ul className="lists d-flex flex-column justify-content-center align-items-center m-auto">
      <TaskList key={allTasks._id} allTasks={allTasks} handleGetTask={handleGetTask} />
    </ul>

    </>
  )
}

export default Todo
