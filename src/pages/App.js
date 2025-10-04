import React, { useState, useEffect, useRef } from 'react';

const STATUS = ['PENDIENTE', 'EN_CURSO', 'FINALIZADO'];

const STATUS_CONFIG = {
  'PENDIENTE': {
    bg: 'bg-slate-50',
    headerBg: 'bg-yellow-200',
    textColor: 'text-yellow-700',
    accentColor: 'bg-yellow-600',
    accentColor2: 'bg-yellow-700',
    borderColor: 'border-yellow-600',
    borderColor2: 'border-yellow-700',
    displayName: 'Pendiente'
  },
  'EN_CURSO': {
    bg: 'bg-slate-50',
    headerBg: 'bg-blue-200',
    textColor: 'text-blue-800',
    accentColor: 'bg-blue-700',
    accentColor2: 'bg-blue-800',
    borderColor: 'border-blue-700',
    borderColor2: 'border-blue-800',
    displayName: 'En Curso'
  },
  'FINALIZADO': {
    bg: 'bg-slate-50',
    headerBg: 'bg-emerald-200',
    textColor: 'text-emerald-800',
    accentColor: 'bg-emerald-700',
    accentColor2: 'bg-emerald-800',
    borderColor: 'border-emerald-700',
    borderColor2: 'border-emerald-800',
    displayName: 'Finalizado'
  }
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const [editingColumn, setEditingColumn] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:3001/tasks', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (res.ok) {
          const data = await res.json();
          setTasks(data);
        } else {
          console.error('Error al obtener tareas:', res.status);
        }
      } catch (error) {
        console.error('Error de conexión:', error);
      }
    };
    fetchTasks();
  }, []);

  useEffect(() => {
    if (editingColumn && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingColumn]);

  const handleCreateTask = async (status) => {
    const title = newTaskTitle.trim();
    if (!title || tasks.some(t => t.title === title)) {
      setEditingColumn(null);
      setNewTaskTitle('');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3001/tasks', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, status }),
      });
      if (res.ok) {
        const savedTask = await res.json();
        setTasks([...tasks, savedTask]);
        setNewTaskTitle('');
        setEditingColumn(null);
      } else {
        console.error('Error al guardar tarea:', res.status);
      }
    } catch (err) {
      console.error('Error de conexión', err);
    }
  };

  const handleCancelCreate = () => {
    setEditingColumn(null);
    setNewTaskTitle('');
  };

  const handleDelete = async id => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3001/tasks/${id}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        setTasks(tasks.filter(t => t.id !== id));
      } else {
        console.error('Error al eliminar tarea:', res.status);
      }
    } catch (error) {
      console.error('Error de conexión:', error);
    }
  };

  const handleMove = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3001/tasks/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
      } else {
        console.error('Error al mover tarea:', res.status);
      }
    } catch (error) {
      console.error('Error de conexión:', error);
    }
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target);
    e.target.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (status) => {
    setDragOverColumn(status);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (draggedTask && draggedTask.status !== newStatus) {
      handleMove(draggedTask.id, newStatus);
    }
    
    setDragOverColumn(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800">
            Tablero Kanban
          </h1>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }}
            className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" className="fill-white">
              <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/>
            </svg>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STATUS.map(status => {
            const config = STATUS_CONFIG[status];
            const isDropTarget = dragOverColumn === status;
            const isEditing = editingColumn === status;
            
            return (
              <div
                key={status}
                className={`${config.bg} rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
                  isDropTarget ? 'ring-4 ring-blue-400 ring-opacity-50 scale-105' : ''
                }`}
                onDragOver={handleDragOver}
                onDragEnter={() => handleDragEnter(status)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, status)}
              >
                <div className={`${config.headerBg} ${config.textColor} px-6 py-4`}>
                  <h2 className="text-xl font-semibold text-center">
                    {config.displayName}
                  </h2>
                  <div className="text-center text-sm mt-1 opacity-75">
                    {tasks.filter(t => t.status === status).length} tareas
                  </div>
                </div>
                
                <div className="p-4 min-h-[400px] flex flex-col">
                  <div className="flex-1 space-y-3 mb-4">
                    {tasks.filter(t => t.status === status).map(task => (
                      <div 
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task)}
                        onDragEnd={handleDragEnd}
                        className="bg-white rounded-lg shadow-md p-4 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 cursor-move group"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span className="text-gray-800 flex-1 font-medium select-none">
                            {task.title}
                          </span>
                          <button
                            onClick={() => handleDelete(task.id)}
                            className="p-1 rounded-md transition-all duration-200 opacity-0 group-hover:opacity-100 hover:bg-red-50"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" className="fill-red-500 hover:fill-red-600 transition-colors duration-200">
                              <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    {/* Área para agregar nueva tarea */}
                    {isEditing ? (
                      <div className="bg-white rounded-lg shadow-md p-4">
                        <input
                          ref={inputRef}
                          type="text"
                          placeholder="Introduce la tarea"
                          value={newTaskTitle}
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleCreateTask(status);
                            } else if (e.key === 'Escape') {
                              handleCancelCreate();
                            }
                          }}
                          className={`w-full px-3 py-2 border-2 ${config.borderColor} rounded-md focus:${config.borderColor2} focus:outline-none mb-3`}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleCreateTask(status)}
                            className={`flex-1 ${config.accentColor} hover:${config.accentColor2} text-white font-medium py-2 px-4 rounded-md transition-colors duration-150`}
                          >
                            Guardar
                          </button>
                          <button
                            onClick={handleCancelCreate}
                            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors duration-150"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (    
                      <button
                        onClick={() => setEditingColumn(status)}
                        className="w-full bg-white bg-opacity-50 hover:bg-opacity-100 border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-lg p-4 transition-all duration-200 text-gray-500 hover:text-gray-700 font-medium"
                      >
                        + Agregar tarea
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;