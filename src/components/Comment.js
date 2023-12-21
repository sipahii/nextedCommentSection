import { useState, useRef, useEffect } from "react";
import Action from "./Action";

const Comment = ({ handleInsertNode, handleEditNode, handleDeleteNode, comment }) => {
  const [input, setInput] = useState({
    name: "",
    comment: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [expand, setExpand] = useState(true);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef?.current?.focus();
  }, [editMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setInput({ ...input, [name]: value });
  };

  const handleNewComment = () => {
    setExpand(!expand);
    setShowInput(true);
  };

  const onAddComment = () => {
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
  return (
    <div className=" m-auto">
      <div className={comment?.id === 1 ? "" : "w-full bg-gray-100 my-3 rounded-lg py-2 px-4"}>
        {comment?.id === 1 ? (
          <div className="w-full bg-gray-100 p-4 rounded-lg">
            <p className="pb-2 font-semibold">Comment</p>
            <input
              type="text"
              className="w-full px-3 py-2 rounded-md mb-3 outline-none"
              autoFocus
              value={input.name}
              onChange={(e) => handleInputChange(e)}
              placeholder="Name"
              name="name"
            />
            <textarea
              className="w-full px-3 py-2 rounded-md mb-3 outline-none"
              rows={3}
              onChange={(e) => handleInputChange(e)}
              placeholder="Comment"
              value={input.comment}
              name="comment"
            />
            <div className="flex justify-end">
              <Action className="cursor-pointer bg-sky-500 text-white px-3 py-1 rounded-md " type="COMMENT" handleClick={onAddComment} />
            </div>
          </div>
        ) : (
          <>
            <div className="relative">
              <h4 className="font-semibold">{comment?.name}</h4>
              <p contentEditable={editMode} suppressContentEditableWarning={editMode} ref={inputRef} style={{ wordWrap: "break-word" }}>
                {comment?.comment}
              </p>

              <div className="flex gap-3 my-2">
                {editMode ? (
                  <>
                    <Action className="text-sky-500 font-semibold text-sm" type="save" handleClick={onAddComment} />
                    <Action
                      className="text-sky-500 font-semibold text-sm"
                      type="cancel"
                      handleClick={() => {
                        if (inputRef.current) inputRef.current.innerText = comment.name;
                        setEditMode(false);
                      }}
                    />
                  </>
                ) : (
                  <>
                    <Action className="text-sky-500 font-semibold text-sm" type={"reply"} handleClick={handleNewComment} />
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
                type={<i className="fa-solid fa-trash-can bg-gray-500 text-white text-[10px] p-1.5 rounded-full"></i>}
                handleClick={handleDelete}
              />
            </div>
          </>
        )}
      </div>

      <div style={{ display: expand ? "block" : "none", paddingLeft: 25 }}>
        {showInput && (
          <div className="bg-gray-100 py-2 px-3">
            <p className="pb-2 font-semibold">Reply</p>
            <input
              type="text"
              className="w-full px-3 py-2 rounded-md mb-3 outline-none"
              autoFocus
              value={input.name}
              onChange={(e) => handleInputChange(e)}
              placeholder="Name"
              name="name"
            />
            <textarea
              className="w-full px-3 py-2 rounded-md mb-3 outline-none"
              rows={3}
              onChange={(e) => handleInputChange(e)}
              placeholder="Comment"
              value={input.comment}
              name="comment"
            />
            <div className="flex gap-3 mb-2 justify-end ">
              <Action className="text-sky-500 font-semibold text-sm" type="reply" handleClick={onAddComment} />
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
          return <Comment key={cmnt.id} handleInsertNode={handleInsertNode} handleEditNode={handleEditNode} handleDeleteNode={handleDeleteNode} comment={cmnt} />;
        })}
      </div>
    </div>
  );
};

export default Comment;
