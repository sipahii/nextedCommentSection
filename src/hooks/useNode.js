const useNode = () => {
  const sortItemsByIdDescending = (obj) => {
    if (obj && obj.items && Array.isArray(obj.items)) {
      obj.items.sort((a, b) => b.id - a.id); // Sort in descending order
      obj.items.forEach((item) => sortItemsByIdDescending(item));
    }
  };

  const insertNode = function (tree, commentId, item) {
    debugger;
    if (tree.id === commentId) {
      tree.items.push({
        id: new Date().getTime(),
        name: item.name,
        comment: item.comment,
        items: [],
      });
      let finalData = tree;
      sortItemsByIdDescending(tree);
      return finalData;
    }

    let latestNode = [];
    latestNode = tree.items.map((ob) => {
      return insertNode(ob, commentId, item);
    });
    let finalData = { ...tree, items: latestNode };
    sortItemsByIdDescending(finalData);
    return finalData;
  };

  const editNode = (tree, commentId, value) => {
    if (tree.id === commentId) {
      tree.comment = value;
      return tree;
    }

    tree.items.map((ob) => {
      return editNode(ob, commentId, value);
    });

    return { ...tree };
  };

  const deleteNode = (tree, id) => {
    for (let i = 0; i < tree.items.length; i++) {
      const currentItem = tree.items[i];
      if (currentItem.id === id) {
        tree.items.splice(i, 1);
        return tree;
      } else {
        deleteNode(currentItem, id);
      }
    }
    return tree;
  };

  return { insertNode, editNode, deleteNode };
};

export default useNode;
