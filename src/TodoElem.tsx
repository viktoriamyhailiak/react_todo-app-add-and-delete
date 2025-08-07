/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from './types/Todo';

type Props = {
  todo: Todo;
  handleInputDoubleClick: (todo: Todo) => void;
  editingId: number | null;
  titleForEditing: string;
  setTitleForEditing: React.Dispatch<React.SetStateAction<string>>;
  handleUpdateTodo: (updatedTodo: Todo) => void;
  editInputRef: React.RefObject<HTMLInputElement>;
  handleDelete: (todoId: number) => void;
  savingId: number | null;
};

export const TodoElem: React.FC<Props> = ({
  todo,
  handleInputDoubleClick,
  editingId,
  titleForEditing,
  setTitleForEditing,
  handleUpdateTodo,
  editInputRef,
  handleDelete,
  savingId,
}) => {
  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
      key={todo.id}
      onDoubleClick={() => handleInputDoubleClick(todo)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      {editingId === todo.id && editingId ? (
        <form
          onSubmit={() => handleUpdateTodo({ ...todo, title: titleForEditing })}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={titleForEditing}
            onChange={e => {
              setTitleForEditing(e.target.value);
            }}
            ref={editInputRef}
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        className={classNames('modal overlay', {
          'is-active': savingId === todo.id,
        })}
        data-cy="TodoLoader"
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
