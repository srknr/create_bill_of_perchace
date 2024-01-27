// // import React from 'react';
// import './App.css';

// import React, { useState } from 'react';

// const App = () => {
//   const [items, setItems] = useState([]);
//   const [itemName, setItemName] = useState('');
//   const [itemAmount, setItemAmount] = useState('');
//   const [totalAmount, setTotalAmount] = useState(0);

//   const handleItemNameChange = (e) => {
//     setItemName(e.target.value);
//   };

//   const handleItemAmountChange = (e) => {
//     setItemAmount(e.target.value);
//   };

//   const handleAddItem = () => {
//     if (itemName && itemAmount) {
//       const newItem = { name: itemName, amount: parseFloat(itemAmount) };
//       setItems([...items, newItem]);
//       setTotalAmount(totalAmount + parseFloat(itemAmount));
//       setItemName('');
//       setItemAmount('');
//     }
//   };

//   const handleConfirm = () => {
//     // ここで確定ボタンが押されたときの処理を実装
//     console.log('Items:', items);
//     console.log('Total Amount:', totalAmount);
//     // 他の必要な処理を追加できます
//   };

//   return (
//     <div>
//       <h1>Expense Tracker</h1>
//       <div>
//         <h2>買取項目</h2>
//         {items.map((item, index) => (
//           <div key={index}>
//             <p>{item.name}: {item.amount}円</p>
//           </div>
//         ))}
//         <div className='inputForm'>
//           <label>品物名:</label>
//           <input type="text" value={itemName} onChange={handleItemNameChange} />
//         </div>
//         <div className='inputForm'>
//           <label>金額　:</label>
//           <input type="number" value={itemAmount} onChange={handleItemAmountChange} />
//         </div>
//         <button onClick={handleAddItem}>フォーム追加</button>
//         <div>
//           <h3>買取合計金額: {totalAmount}円</h3>
//         </div>
//         <button onClick={handleConfirm}>確定</button>
//         <div>
//         <ul>
//         {items.map((item, index) => (
//           <li key={index}>{item.name}, {item.amount}</li>
//         ))}
//       </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default App;

import React, { useState } from 'react';

const App = () => {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [itemAmount, setItemAmount] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [editingIndex, setEditingIndex] = useState(null);

  const handleItemNameChange = (e) => {
    setItemName(e.target.value);
  };

  const handleItemAmountChange = (e) => {
    setItemAmount(e.target.value);
  };

  const handleAddItem = () => {
    if (itemName && itemAmount) {
      if (editingIndex !== null) {
        // Editing existing item
        const updatedItems = [...items];
        const editedItem = updatedItems[editingIndex];
        editedItem.name = itemName;
        editedItem.amount = parseFloat(itemAmount);
        setItems(updatedItems);
        setEditingIndex(null);
      } else {
        // Adding new item
        const newItem = { name: itemName, amount: parseFloat(itemAmount) };
        setItems([...items, newItem]);
      }

      setTotalAmount(calculateTotalAmount([...items, { name: itemName, amount: parseFloat(itemAmount) }]));
      setItemName('');
      setItemAmount('');
    }
  };

  const handleEditItem = (index) => {
    const itemToEdit = items[index];
    setItemName(itemToEdit.name);
    setItemAmount(itemToEdit.amount.toString());
    setEditingIndex(index);
  };

  const handleDeleteItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    setTotalAmount(calculateTotalAmount(updatedItems));
  };

  const calculateTotalAmount = (items) => {
    return items.reduce((total, item) => total + item.amount, 0);
  };

  const formatAmountWithCommas = (amount) => {
    return amount.toLocaleString();
  };

  return (
    <div className='app'>
      <div className='main'>
      <h1>見積書作成</h1>
      <div>
        <h2>買取項目入力</h2>
        {items.map((item, index) => (
          <div key={index}>
            <p>{item.name}:  {formatAmountWithCommas(item.amount)}円
            <button className='editButton' onClick={() => handleEditItem(index)}>編集</button>
            <button className='deleteButton' onClick={() => handleDeleteItem(index)}>削除</button>
        </p>
          </div>
        ))}
        <div className='inputForm'>
          <label>品物名:</label>
          <input type="text" value={itemName} onChange={handleItemNameChange} />
    
          <label>金額　:</label>
          <input type="number" value={itemAmount} onChange={handleItemAmountChange} />
        </div>
        <p className='inputForm'>
        <button  onClick={handleAddItem}>{editingIndex !== null ? '項目編集' : '項目追加'}</button>
        </p>
        <div>
          <h3>合計金額：  {formatAmountWithCommas(totalAmount)}円</h3>
        </div>
      </div>
      </div>
    </div>
  );
};

export default App;
