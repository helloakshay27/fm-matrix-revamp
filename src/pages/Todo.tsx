import { useEffect, useState } from 'react';
import { Trash2, Plus, Check } from 'lucide-react';
import axios from 'axios';
import AddToDoModal from '@/components/AddToDoModal';
import { Button } from '@/components/ui/button';

export default function Todo() {
    const baseUrl = localStorage.getItem('baseUrl');
    const [isAddTodoModalOpen, setIsAddTodoModalOpen] = useState(false);
    const [todos, setTodos] = useState([]);

    const getTodos = async () => {
        try {
            const response = await axios.get(`https://${baseUrl}/todos.json`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setTodos(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getTodos();
    }, []);

    const toggleTodo = async (id) => {
        const updatedTodos = todos.map((todo) =>
            todo.id === id ? { ...todo, status: todo.status === 'open' ? 'completed' : 'open' } : todo
        );

        setTodos(updatedTodos);

        const updatedTodo = updatedTodos.find((t) => t.id === id);

        try {
            await axios.put(
                `https://${baseUrl}/todos/${id}.json`,
                {
                    todo: {
                        status: updatedTodo.status,
                    },
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
        } catch (error) {
            console.log(error);
        }
    };

    const deleteTodo = (id) => {
        setTodos(todos.filter((todo) => todo.id !== id));
    };

    const pendingTodos = todos.filter((t) => t.status !== 'completed');
    const completedTodos = todos.filter((t) => t.status === 'completed');

    // ------------------------------
    // DATE GROUPING
    // ------------------------------
    const today = new Date().toISOString().split('T')[0];

    const overdueTodos = pendingTodos.filter((t) => t.target_date && t.target_date < today);

    const todayTodos = pendingTodos.filter((t) => t.target_date === today);

    const upcomingTodos = pendingTodos.filter((t) => t.target_date && t.target_date > today);

    // fallback group if any todo has no target date
    const noDateTodos = pendingTodos.filter((t) => !t.target_date);

    return (
        <div className="p-6">
            <div className="space-y-4">
                <div className="flex items-center justify-end">
                    <Button
                        onClick={() => setIsAddTodoModalOpen(true)}
                        className="text-[12px] flex items-center justify-center gap-1 bg-red text-white px-3 py-2 w-max"
                    >
                        <Plus size={18} />
                        Add To-Do
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* ------------------------------------
                        Pending Tasks Section
                    ------------------------------------ */}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-1 h-6 bg-[#c72030] rounded-full" />
                            <h2 className="text-2xl font-bold text-foreground">TO DO</h2>
                            <span className="ml-auto bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                                {pendingTodos.length}
                            </span>
                        </div>

                        <div className="flex-1 bg-white rounded-lg border border-border shadow-sm p-4 space-y-6 min-h-96 overflow-auto">
                            {/* Overdue */}
                            {overdueTodos.length > 0 && (
                                <div>
                                    <h3 className="text-red-600 font-semibold mb-2">Overdue</h3>
                                    {overdueTodos.map((todo) => (
                                        <TodoItem
                                            key={todo.id}
                                            todo={todo}
                                            toggleTodo={toggleTodo}
                                            deleteTodo={deleteTodo}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Today */}
                            {todayTodos.length > 0 && (
                                <div>
                                    <h3 className="text-primary font-semibold mb-2">Today</h3>
                                    {todayTodos.map((todo) => (
                                        <TodoItem
                                            key={todo.id}
                                            todo={todo}
                                            toggleTodo={toggleTodo}
                                            deleteTodo={deleteTodo}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Upcoming */}
                            {upcomingTodos.length > 0 && (
                                <div>
                                    <h3 className="text-blue-600 font-semibold mb-2">Upcoming</h3>
                                    {upcomingTodos.map((todo) => (
                                        <TodoItem
                                            key={todo.id}
                                            todo={todo}
                                            toggleTodo={toggleTodo}
                                            deleteTodo={deleteTodo}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* No Target Date */}
                            {noDateTodos.length > 0 && (
                                <div>
                                    <h3 className="text-gray-500 font-semibold mb-2">No Target Date</h3>
                                    {noDateTodos.map((todo) => (
                                        <TodoItem
                                            key={todo.id}
                                            todo={todo}
                                            toggleTodo={toggleTodo}
                                            deleteTodo={deleteTodo}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Empty State */}
                            {pendingTodos.length === 0 && (
                                <div className="flex items-center justify-center h-full">
                                    <p className="text-muted-foreground text-center">
                                        No pending tasks! You're all caught up.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ------------------------------------
                        Completed Section
                    ------------------------------------ */}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-1 h-6 bg-green-600 rounded-full" />
                            <h2 className="text-2xl font-bold text-foreground">Completed</h2>
                            <span className="ml-auto bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-semibold">
                                {completedTodos.length}
                            </span>
                        </div>

                        <div className="flex-1 bg-white rounded-lg border border-border shadow-sm p-4 space-y-2 min-h-96 overflow-auto">
                            {completedTodos.length === 0 ? (
                                <div className="flex items-center justify-center h-full">
                                    <p className="text-muted-foreground text-center">
                                        Complete tasks to see them here.
                                    </p>
                                </div>
                            ) : (
                                completedTodos.map((todo) => (
                                    <div
                                        key={todo.id}
                                        className="flex items-center gap-3 p-3 rounded-lg bg-accent/5 hover:bg-accent/10 transition-colors group"
                                    >
                                        <button
                                            onClick={() => toggleTodo(todo.id)}
                                            className="flex-shrink-0 w-5 h-5 bg-accent flex items-center justify-center hover:opacity-90 transition-all"
                                        >
                                            <Check size={16} className="text-accent-foreground" />
                                        </button>
                                        {/* <span className="flex-1 text-base text-muted-foreground line-through">{todo.title}</span> */}
                                        <div className="flex flex-col flex-1">
                                            <span className="text-base text-foreground">{todo.title}</span>
                                            {todo.target_date && (
                                                <span className="text-xs text-muted-foreground">
                                                    Due: {todo.target_date}
                                                </span>
                                            )}
                                        </div>
                                        {/* <button
                                            onClick={() => deleteTodo(todo.id)}
                                            className="flex-shrink-0 p-1.5 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 size={18} />
                                        </button> */}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {isAddTodoModalOpen && (
                <AddToDoModal
                    isModalOpen={isAddTodoModalOpen}
                    setIsModalOpen={setIsAddTodoModalOpen}
                    getTodos={getTodos}
                />
            )}
        </div>
    );
}

// ----------------------------------------------
// Separate Todo Item Component (Cleaner UI)
// ----------------------------------------------
const TodoItem = ({ todo, toggleTodo, deleteTodo }) => {
    return (
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors group">
            <button
                onClick={() => toggleTodo(todo.id)}
                className="flex-shrink-0 w-4 h-4 border-2 border-primary flex items-center justify-center"
            >
                <Check size={16} className="text-primary opacity-0 group-hover:opacity-100" />
            </button>

            <div className="flex flex-col flex-1">
                <span className="text-base text-foreground">{todo.title}</span>
                {todo.target_date && (
                    <span className="text-xs text-muted-foreground">Due: {todo.target_date}</span>
                )}
            </div>

            {/* <button
                onClick={() => deleteTodo(todo.id)}
                className="flex-shrink-0 p-1.5 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
            >
                <Trash2 size={18} />
            </button> */}
        </div>
    );
};
