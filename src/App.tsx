/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  deleteTodo,
  getTodos,
  postTodo,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './Header';
import { TodoElem } from './TodoElem';
import { Footer } from './Footer';
import { ErrorComponent } from './Error';
import { TodoItem } from './TodoItem';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [value, setValue] = useState<string>('');
  const [selectedLink, setSelectedLink] = useState<string>('all');
  const [savingId, setSavingID] = useState<number | null>(null);

  const [isLoadError, setIsLoadError] = useState<boolean>(false);
  const [isTitleError, setIsTitleError] = useState<boolean>(false);
  const [isAddError, setIsAddError] = useState<boolean>(false);
  const [isDeleteError, setIsDeleteError] = useState<boolean>(false);
  const [isUpdateError, setIsUpdateError] = useState<boolean>(false);
  const [titleForEditing, setTitleForEditing] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const titleField = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const serverTodosCount = useRef<number>(0);
  const isError =
    isAddError || isDeleteError || isLoadError || isTitleError || isUpdateError;

  function hideError(setError: React.Dispatch<React.SetStateAction<boolean>>) {
    setTimeout(() => setError(false), 3000);
  }

  useEffect(() => {
    if (!isLoading && titleField.current) {
      titleField.current.focus();
    }
  }, [isLoading, isTitleError]);

  useEffect(() => {
    if (editingId !== null) {
      const editingTodo = todos.find(todo => todo.id === editingId);

      if (editingTodo) {
        setTitleForEditing(editingTodo.title);
      }

      editInputRef.current?.focus();
    }
  }, [editingId, todos]);

  useEffect(() => {
    setIsLoading(true);

    getTodos()
      .catch(() => {
        setIsLoadError(true);
        hideError(setIsLoadError);

        throw new Error('not working');
      })
      .then(result => {
        if (selectedLink === 'completed') {
          setTodos(result.filter(x => x.completed === true));
        } else if (selectedLink === 'active') {
          setTodos(result.filter(x => x.completed === false));
        } else {
          setTodos(result);
        }

        serverTodosCount.current = result.length;
      })
      .finally(() => setIsLoading(false));
  }, [selectedLink]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    setIsAddError(false);
    setIsTitleError(false);
    setIsLoadError(false);
    setIsDeleteError(false);
    setIsUpdateError(false);

    const maxId = Math.max(...todos.map(todo => todo.id)) + 1;
    const trimmed = value.trim();

    e.preventDefault();
    setIsLoading(true);
    setSavingID(maxId);

    if (!trimmed) {
      setIsTitleError(true);
      hideError(setIsTitleError);
      setIsLoading(false);

      return;
    }

    setTempTodo({
      title: trimmed,
      id: 0,
      userId: USER_ID,
      completed: false,
    });

    const data = {
      title: trimmed,
      userId: USER_ID,
      completed: false,
      id: maxId,
    };

    postTodo(data)
      .then((newTodo: Todo) => {
        setTodos([...todos, newTodo]);
        setSavingID(newTodo.id);
        setValue('');
      })
      .catch(() => {
        setIsAddError(true);
        hideError(setIsAddError);
        setValue(value);
      })
      .finally(() => {
        setIsLoading(false);
        setSavingID(null);
        setTempTodo(null);
      });
  }

  function handleDelete(todoId: number) {
    setIsAddError(false);
    setIsTitleError(false);
    setIsLoadError(false);
    setIsDeleteError(false);
    setSavingID(todoId);
    setIsLoading(true);
    setIsUpdateError(false);

    deleteTodo(todoId)
      .catch(() => {
        setIsDeleteError(true);
        hideError(setIsDeleteError);

        throw new Error();
      })
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .finally(() => {
        setSavingID(null);
        setIsLoading(false);
      });
  }

  function deleteAllCompleted() {
    setIsAddError(false);
    setIsTitleError(false);
    setIsLoadError(false);
    setIsDeleteError(false);
    setIsLoading(true);
    setIsUpdateError(false);

    const completed = todos.filter(todo => todo.completed);
    const deletePromises = completed.map(todo => deleteTodo(todo.id));

    Promise.all(deletePromises)
      .catch(() => {
        setIsDeleteError(true);
        hideError(setIsDeleteError);

        return;
      })
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => !todo.completed));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleUpdateTodo(updatedTodo: Todo) {
    setIsAddError(false);
    setIsTitleError(false);
    setIsLoadError(false);
    setIsDeleteError(false);
    setIsLoading(true);
    setIsUpdateError(false);
    const trimmedTitle = titleForEditing.trim();

    if (!trimmedTitle) {
      setIsUpdateError(true);
      hideError(setIsUpdateError);
      setEditingId(null);

      return;
    }

    setIsLoading(true);
    setSavingID(updatedTodo.id);

    updateTodo(updatedTodo)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === updatedTodo.id
              ? { ...todo, title: trimmedTitle }
              : todo,
          ),
        );
      })
      .catch(() => {
        setIsUpdateError(true);
        hideError(setIsUpdateError);
      })
      .finally(() => {
        setEditingId(null);
        setTitleForEditing('');
        setIsLoading(false);
        setSavingID(null);
      });
  }

  function handleInputDoubleClick(elem: Todo) {
    setEditingId(elem.id);
    setTitleForEditing(elem.title);
  }

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          value={value}
          todos={todos}
          handleSubmit={handleSubmit}
          setValue={setValue}
          titleField={titleField}
          isLoading={isLoading}
        />

        {(todos.length > 0 || tempTodo) && (
          <section className="todoapp__main" data-cy="TodoList">
            {todos.map(todo => (
              <TodoElem
                key={todo.id}
                todo={todo}
                handleInputDoubleClick={handleInputDoubleClick}
                editingId={editingId}
                titleForEditing={titleForEditing}
                setTitleForEditing={setTitleForEditing}
                handleUpdateTodo={handleUpdateTodo}
                editInputRef={editInputRef}
                handleDelete={handleDelete}
                savingId={savingId}
              />
            ))}

            {tempTodo && <TodoItem tempTodo={tempTodo} />}
          </section>
        )}

        {serverTodosCount.current > 0 && (
          <Footer
            setSelectedLink={setSelectedLink}
            selectedLink={selectedLink}
            todos={todos}
            deleteAllCompleted={deleteAllCompleted}
          />
        )}
      </div>

      <ErrorComponent
        isError={isError}
        isAddError={isAddError}
        isDeleteError={isDeleteError}
        isLoadError={isLoadError}
        isUpdateError={isUpdateError}
        isTitleError={isTitleError}
      />
    </div>
  );
};
