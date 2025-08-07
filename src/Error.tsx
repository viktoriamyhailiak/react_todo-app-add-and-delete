import classNames from 'classnames';

type Props = {
  isError: boolean;
  isAddError: boolean;
  isDeleteError: boolean;
  isLoadError: boolean;
  isUpdateError: boolean;
  isTitleError: boolean;
};

export const ErrorComponent: React.FC<Props> = ({
  isError,
  isAddError,
  isDeleteError,
  isLoadError,
  isUpdateError,
  isTitleError,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !isError },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={e => {
          const parent = (e.target as HTMLButtonElement).parentElement;

          if (parent) {
            parent.classList.add('hidden');
          }
        }}
      />
      {isLoadError
        ? 'Unable to load todos'
        : isTitleError
          ? 'Title should not be empty'
          : isAddError
            ? 'Unable to add a todo'
            : isDeleteError
              ? 'Unable to delete a todo'
              : isUpdateError
                ? 'Unable to update a todo'
                : ''}
    </div>
  );
};
