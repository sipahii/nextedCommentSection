import { useEffect, useState } from "react";
import Comment from "./components/Comment";
import useNode from "./hooks/useNode";

const comments = {
  id: 1,
  items: [],
};
const App = () => {
  const [commentsData, setCommentsData] = useState(comments);

  const { insertNode, editNode, deleteNode } = useNode();

  const handleInsertNode = (folderId, item) => {
    const finalStructure = insertNode(commentsData, folderId, item);
    setDataInLocalStorage(finalStructure);
    setCommentsData(finalStructure);
  };

  const handleEditNode = (folderId, value) => {
    const finalStructure = editNode(commentsData, folderId, value);
    setDataInLocalStorage(finalStructure);
    setCommentsData(finalStructure);
  };

  const handleDeleteNode = (folderId) => {
    const finalStructure = deleteNode(commentsData, folderId);
    const temp = { ...finalStructure };
    setDataInLocalStorage(temp);
    setCommentsData(temp);
  };

  const setDataInLocalStorage = (data = comments) => {
    window.localStorage.setItem("item", JSON.stringify(data));
  };

  useEffect(() => {
    if (window) {
      let data = JSON.parse(window.localStorage.getItem("item"));
      console.log(data);
      if (data) {
        setCommentsData(data);
      }
    }
  }, []);

  return (
    <div className="w-full m-auto lg:w-6/12 p-4">
      <Comment
        handleInsertNode={handleInsertNode}
        handleEditNode={handleEditNode}
        handleDeleteNode={handleDeleteNode}
        comment={commentsData}
        childLabel={1}
      />
    </div>
  );
};

export default App;
