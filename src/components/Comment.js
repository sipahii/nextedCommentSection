import { useState, useRef, useEffect } from "react";
import Action from "./Action";

const Comment = ({
  handleInsertNode,
  handleEditNode,
  handleDeleteNode,
  comment,
  childLabel,
}) => {
  const [input, setInput] = useState({
    name: "",
    comment: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [expand, setExpand] = useState(true);
  const [errors, setErrors] = useState({
    name: "",
    comment: "",
  });
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef?.current?.focus();
  }, [editMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setInput({ ...input, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleNewComment = () => {
    setExpand(!expand);
    setShowInput(true);
  };

  const onAddComment = () => {
    const newErrors = {};
    if (!input.name.trim()) {
      newErrors.name = "Name is required*";
    }
    if (!input.comment.trim()) {
      newErrors.comment = "Comment is required*";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (editMode) {
      handleEditNode(comment.id, inputRef?.current?.innerText);
    } else {
      setExpand(true);
      handleInsertNode(comment.id, input);
      setShowInput(false);
      setInput({
        name: "",
        comment: "",
      });
    }

    if (editMode) setEditMode(false);
  };

  const handleDelete = () => {
    handleDeleteNode(comment.id);
  };

  const getFormatDat = (timestamp) => {
    const date = new Date(timestamp);

    const options = { day: "numeric", month: "short", year: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", options);
    return formattedDate;
  };

  return (
    <div className="m-auto">
      <div
        className={
          comment?.id === 1
            ? ""
            : "w-full bg-gray-100 my-3 rounded-lg py-2 px-4"
        }
      >
        {comment?.id === 1 ? (
          <div className="w-full bg-gray-100 p-4 rounded-lg">
            <p className="pb-2 font-semibold">Comment</p>
            <input
              type="text"
              className={`w-full px-3 py-2 rounded-md mb-1 outline-none ${
                errors.name && "border-red-500"
              }`}
              autoFocus
              value={input.name}
              onChange={(e) => handleInputChange(e)}
              placeholder="Name"
              name="name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm pb-2">{errors.name}</p>
            )}
            <textarea
              className={`w-full px-3 py-2 rounded-md mb-1 outline-none ${
                errors.comment && "border-red-500"
              }`}
              rows={3}
              onChange={(e) => handleInputChange(e)}
              placeholder="Comment"
              value={input.comment}
              name="comment"
            />
            {errors.comment && (
              <p className="text-red-500 text-sm p-b-2">{errors.comment}</p>
            )}
            <div className="flex justify-end">
              <Action
                className="cursor-pointer bg-sky-500 text-white px-3 py-1 rounded-md "
                type="POST"
                handleClick={onAddComment}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="relative">
              <div className="flex justify-between">
                <h4 className="font-semibold">{comment?.name}</h4>
                <span>{getFormatDat(comment.id)}</span>
              </div>

              <p
                contentEditable={editMode}
                suppressContentEditableWarning={editMode}
                ref={inputRef}
                style={{ wordWrap: "break-word" }}
              >
                {comment?.comment}
              </p>
              <div className="flex gap-3 my-2">
                {editMode ? (
                  <>
                    <Action
                      className="text-sky-500 font-semibold text-sm"
                      type="save"
                      handleClick={onAddComment}
                    />
                    <Action
                      className="text-sky-500 font-semibold text-sm"
                      type="cancel"
                      handleClick={() => {
                        if (inputRef.current)
                          inputRef.current.innerText = comment.name;
                        setEditMode(false);
                      }}
                    />
                  </>
                ) : (
                  <>
                    {childLabel <= 2 && (
                      <Action
                        className="text-sky-500 font-semibold text-sm"
                        type={"reply"}
                        handleClick={handleNewComment}
                      />
                    )}
                    <Action
                      className="text-sky-500 font-semibold text-sm"
                      type="edit"
                      handleClick={() => {
                        setEditMode(true);
                      }}
                    />
                  </>
                )}
              </div>
              <Action
                className="absolute top-[35%] -right-6"
                type={
                  <i className="fa-solid fa-trash-can bg-gray-500 text-white text-[10px] p-1.5 rounded-full"></i>
                }
                handleClick={handleDelete}
              />
            </div>
          </>
        )}
      </div>

      <div style={{ paddingLeft: 25 }}>
        {showInput && (
          <div className="bg-gray-100 py-2 px-3">
            <p className="pb-2 font-semibold">Reply</p>
            <input
              type="text"
              className={`w-full px-3 py-2 rounded-md mb-3 outline-none ${
                errors.name && "border-red-500"
              }`}
              autoFocus
              value={input.name}
              onChange={(e) => handleInputChange(e)}
              placeholder="Name"
              name="name"
            />
            {errors.name && (
              <p className="text-red-500  text-sm py-2">{errors.name}</p>
            )}
            <textarea
              className={`w-full px-3 py-2 rounded-md mb-3 outline-none ${
                errors.comment && "border-red-500"
              }`}
              rows={3}
              onChange={(e) => handleInputChange(e)}
              placeholder="Comment"
              value={input.comment}
              name="comment"
            />
            {errors.comment && (
              <p className="text-red-500 text-sm py-2">{errors.comment}</p>
            )}
            <div className="flex gap-3 mb-2 justify-end ">
              <Action
                className="text-sky-500 font-semibold text-sm"
                type="POST"
                handleClick={onAddComment}
              />
              <Action
                className="text-sky-500 font-semibold text-sm"
                type="cancel"
                handleClick={() => {
                  setShowInput(false);
                  if (!comment?.items?.length) setExpand(false);
                }}
              />
            </div>
          </div>
        )}

        {comment?.items?.map((cmnt) => {
          return (
            <Comment
              key={cmnt.id}
              handleInsertNode={handleInsertNode}
              handleEditNode={handleEditNode}
              handleDeleteNode={handleDeleteNode}
              comment={cmnt}
              childLabel={childLabel + 1}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Comment;
