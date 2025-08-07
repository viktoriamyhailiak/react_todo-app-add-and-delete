import classNames from 'classnames';
import { Todo } from './types/Todo';

type Props = {
  value: string;
  todos: Todo[];
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  titleField: React.RefObject<HTMLInputElement>;
  isLoading: boolean;
};

export const Header: React.FC<Props> = ({
  value,
  todos,
  handleSubmit,
  setValue,
  titleField,
  isLoading,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: !todos.find(x => x.completed === false),
        })}
        data-cy="ToggleAllButton"
      />

      <form
        onSubmit={e => {
          e.preventDefault();
          handleSubmit(e);
        }}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={value}
          onChange={e => setValue(e.target.value)}
          ref={titleField}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
