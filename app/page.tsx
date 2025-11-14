'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Plus, Edit2, Trash2, Play, Square, Check, Circle, Clock } from 'lucide-react';

interface Task {
  id: string;
  time: string;
  title: string;
  notes: string[];
  isRunning: boolean;
  isCompleted: boolean;
  progress: number;
  elapsedTime: number;
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      time: '09:00',
      title: 'Morning Standup',
      notes: ['Review team goals', 'Update project status'],
      isRunning: false,
      isCompleted: false,
      progress: 0,
      elapsedTime: 0,
    },
    {
      id: '2',
      time: '10:30',
      title: 'Design Review',
      notes: ['Present mockups', 'Gather feedback', 'Iterate on designs'],
      isRunning: false,
      isCompleted: false,
      progress: 0,
      elapsedTime: 0,
    },
    {
      id: '3',
      time: '14:00',
      title: 'Development Sprint',
      notes: ['Implement new features', 'Code review', 'Write tests'],
      isRunning: false,
      isCompleted: false,
      progress: 0,
      elapsedTime: 0,
    },
    {
      id: '4',
      time: '16:30',
      title: 'Client Meeting',
      notes: ['Project update', 'Discuss timeline'],
      isRunning: false,
      isCompleted: false,
      progress: 0,
      elapsedTime: 0,
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [streak, setStreak] = useState(7);

  // Timer state
  const [timerMode, setTimerMode] = useState<'timer' | 'stopwatch'>('timer');
  const [timerSeconds, setTimerSeconds] = useState(1500); // 25 minutes default
  const [timerCustomInput, setTimerCustomInput] = useState('25:00');
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerStartTime, setTimerStartTime] = useState<number | null>(null);

  // Stopwatch state
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);

  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Calculate daily progress
  const completedTasks = tasks.filter(t => t.isCompleted).length;
  const totalTasks = tasks.length;
  const progressPercent = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Timer/Stopwatch logic
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timerMode === 'timer' && isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerMode === 'stopwatch' && isStopwatchRunning) {
      interval = setInterval(() => {
        setStopwatchTime(prev => prev + 10);
      }, 10);
    }

    return () => clearInterval(interval);
  }, [timerMode, isTimerRunning, isStopwatchRunning, timerSeconds]);

  // Task timer logic
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks(prev => prev.map(task => {
        if (task.isRunning && !task.isCompleted) {
          return {
            ...task,
            elapsedTime: task.elapsedTime + 1,
            progress: Math.min(task.progress + 0.5, 100),
          };
        }
        return task;
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id
        ? { ...task, isRunning: !task.isRunning }
        : task
    ));
  };

  const completeTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id
        ? { ...task, isCompleted: !task.isCompleted, isRunning: false, progress: task.isCompleted ? task.progress : 100 }
        : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const addTask = () => {
    const newTask: Task = {
      id: Date.now().toString(),
      time: '18:00',
      title: 'New Task',
      notes: [],
      isRunning: false,
      isCompleted: false,
      progress: 0,
      elapsedTime: 0,
    };
    setTasks([...tasks, newTask]);
    setShowAddModal(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatStopwatch = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    const [mins] = timerCustomInput.split(':').map(Number);
    setTimerSeconds(mins * 60);
  };

  const resetStopwatch = () => {
    setIsStopwatchRunning(false);
    setStopwatchTime(0);
    setLaps([]);
  };

  const addLap = () => {
    setLaps([...laps, stopwatchTime]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-apple-gray-50 to-apple-gray-100">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 glass border-b border-apple-gray-200"
      >
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-apple-gray-900">Today</h1>
            <p className="text-sm text-apple-gray-500">{dateString}</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Streak Counter */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl px-4 py-2 shadow-apple flex items-center gap-2"
            >
              <div className="text-2xl">🔥</div>
              <div>
                <div className="text-xs text-apple-gray-500">Streak</div>
                <div className="text-lg font-semibold">{streak} days</div>
              </div>
            </motion.div>

            {/* Progress Ring */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative w-20 h-20"
            >
              <svg className="transform -rotate-90 w-20 h-20">
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  stroke="#e5e5e5"
                  strokeWidth="6"
                  fill="none"
                />
                <motion.circle
                  cx="40"
                  cy="40"
                  r="32"
                  stroke="#007AFF"
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: '201 201', strokeDashoffset: 201 }}
                  animate={{
                    strokeDashoffset: 201 - (201 * progressPercent / 100)
                  }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-sm font-semibold">{Math.round(progressPercent)}%</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Timer/Stopwatch Widget */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8 bg-white rounded-3xl shadow-apple-lg p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-apple-gray-500" />
              <h2 className="text-xl font-semibold">Focus Timer</h2>
            </div>

            {/* Mode Toggle */}
            <div className="bg-apple-gray-100 rounded-full p-1 flex">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setTimerMode('timer');
                  setIsTimerRunning(false);
                  setIsStopwatchRunning(false);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  timerMode === 'timer'
                    ? 'bg-white text-apple-gray-900 shadow-apple'
                    : 'text-apple-gray-600'
                }`}
              >
                Timer
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setTimerMode('stopwatch');
                  setIsTimerRunning(false);
                  setIsStopwatchRunning(false);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  timerMode === 'stopwatch'
                    ? 'bg-white text-apple-gray-900 shadow-apple'
                    : 'text-apple-gray-600'
                }`}
              >
                Stopwatch
              </motion.button>
            </div>
          </div>

          {timerMode === 'timer' ? (
            <div className="text-center">
              {/* Timer Display */}
              <div className="relative w-64 h-64 mx-auto mb-8">
                <svg className="transform -rotate-90 w-64 h-64">
                  <circle
                    cx="128"
                    cy="128"
                    r="112"
                    stroke="#f5f5f5"
                    strokeWidth="12"
                    fill="white"
                  />
                  <motion.circle
                    cx="128"
                    cy="128"
                    r="112"
                    stroke="#007AFF"
                    strokeWidth="12"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray="703.7"
                    strokeDashoffset={703.7 - (703.7 * (timerSeconds / 1500))}
                    transition={{ duration: 0.3 }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl font-light tracking-tight">
                    {formatTime(timerSeconds)}
                  </div>
                </div>
              </div>

              {/* Timer Controls */}
              <div className="flex items-center justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full shadow-apple-lg flex items-center justify-center"
                >
                  {isTimerRunning ? <Square className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetTimer}
                  className="px-6 py-3 bg-apple-gray-100 text-apple-gray-700 rounded-full font-medium"
                >
                  Reset
                </motion.button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              {/* Stopwatch Display */}
              <div className="text-7xl font-light tracking-tight mb-8 py-8">
                {formatStopwatch(stopwatchTime)}
              </div>

              {/* Stopwatch Controls */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsStopwatchRunning(!isStopwatchRunning)}
                  className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full shadow-apple-lg flex items-center justify-center"
                >
                  {isStopwatchRunning ? <Square className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
                </motion.button>

                {isStopwatchRunning && (
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={addLap}
                    className="px-6 py-3 bg-apple-gray-100 text-apple-gray-700 rounded-full font-medium"
                  >
                    Lap
                  </motion.button>
                )}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetStopwatch}
                  className="px-6 py-3 bg-apple-gray-100 text-apple-gray-700 rounded-full font-medium"
                >
                  Reset
                </motion.button>
              </div>

              {/* Laps */}
              {laps.length > 0 && (
                <div className="max-h-40 overflow-y-auto">
                  <div className="space-y-2">
                    {laps.map((lap, index) => (
                      <motion.div
                        key={index}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="flex justify-between items-center px-4 py-2 bg-apple-gray-50 rounded-xl"
                      >
                        <span className="text-apple-gray-600 font-medium">Lap {laps.length - index}</span>
                        <span className="text-apple-gray-900 font-mono">{formatStopwatch(lap)}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Control Bar */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 flex items-center justify-between"
        >
          <h2 className="text-xl font-semibold text-apple-gray-900">Your Schedule</h2>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addTask}
            className="bg-blue-500 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-apple hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add Task</span>
          </motion.button>
        </motion.div>

        {/* Task Timeline */}
        <Reorder.Group
          axis="y"
          values={tasks}
          onReorder={setTasks}
          className="space-y-4"
        >
          <AnimatePresence mode="popLayout">
            {tasks.map((task, index) => (
              <Reorder.Item
                key={task.id}
                value={task}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className="cursor-grab active:cursor-grabbing"
              >
                <motion.div
                  className={`bg-white rounded-3xl shadow-apple-lg p-6 transition-all ${
                    task.isCompleted ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Time Block */}
                    <div className="flex-shrink-0 w-20">
                      <div className="text-2xl font-semibold text-apple-gray-900">{task.time}</div>
                      <div className="text-xs text-apple-gray-500 mt-1">
                        {Math.floor(task.elapsedTime / 60)}m {task.elapsedTime % 60}s
                      </div>
                    </div>

                    {/* Timeline Connector */}
                    <div className="flex-shrink-0 flex flex-col items-center pt-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => completeTask(task.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          task.isCompleted
                            ? 'bg-blue-500 border-blue-500'
                            : 'border-apple-gray-300 bg-white hover:border-blue-500'
                        }`}
                      >
                        {task.isCompleted && <Check className="w-4 h-4 text-white" />}
                      </motion.button>
                      {index < tasks.length - 1 && (
                        <div className="w-0.5 h-full bg-apple-gray-200 mt-2" />
                      )}
                    </div>

                    {/* Task Content */}
                    <div className="flex-grow min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-grow">
                          <h3 className={`text-lg font-semibold mb-1 ${
                            task.isCompleted ? 'line-through text-apple-gray-500' : 'text-apple-gray-900'
                          }`}>
                            {task.title}
                          </h3>

                          {/* Notes/Subtasks */}
                          {task.notes.length > 0 && (
                            <ul className="space-y-1 mb-3">
                              {task.notes.map((note, i) => (
                                <li key={i} className="text-sm text-apple-gray-600 flex items-center gap-2">
                                  <Circle className="w-1.5 h-1.5 fill-current" />
                                  {note}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 ml-4">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setEditingTask(task.id)}
                            className="p-2 hover:bg-apple-gray-100 rounded-full transition-colors"
                          >
                            <Edit2 className="w-4 h-4 text-apple-gray-500" />
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => deleteTask(task.id)}
                            className="p-2 hover:bg-red-50 rounded-full transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </motion.button>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="h-2 bg-apple-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${task.progress}%` }}
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-apple-gray-500">{Math.round(task.progress)}% complete</span>
                        </div>
                      </div>

                      {/* Start/Stop Button */}
                      {!task.isCompleted && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleTask(task.id)}
                          className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-all ${
                            task.isRunning
                              ? 'bg-red-500 text-white shadow-apple'
                              : 'bg-blue-500 text-white shadow-apple'
                          }`}
                        >
                          {task.isRunning ? (
                            <>
                              <Square className="w-4 h-4" />
                              Stop
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4" />
                              Start
                            </>
                          )}
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              </Reorder.Item>
            ))}
          </AnimatePresence>
        </Reorder.Group>

        {/* Empty State */}
        {tasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-apple-gray-900 mb-2">No tasks yet</h3>
            <p className="text-apple-gray-500 mb-6">Add your first task to get started</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addTask}
              className="bg-blue-500 text-white px-6 py-3 rounded-full font-medium shadow-apple"
            >
              Add Task
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
