
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate, useLocation} from 'react-router-dom';
import './App.css';

function MainPage({totalAmount, setTotalAmount}) {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState('1');
  const [itemAmount, setItemAmount] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [remarks, setRemarks] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const navigate = useNavigate(); 

  const handleItemNameChange = (e) => {
    setItemName(e.target.value);
  };

  const handleItemAmountChange = (e) => {
    setItemAmount(e.target.value);
  };

  const handleItemQuantityChange = (e) => {
    setItemQuantity(e.target.value);
  };

  const handleCustomerNameChange = (e) => {
    setCustomerName(e.target.value);
  }

  const handleRemarksChange = (e) => {
    setRemarks(e.target.value);
  }


  const handleAddItem = () => {
    if (itemName && itemAmount && itemQuantity) {
      if (editingIndex !== null) {
        // Editing existing item
        
        const updatedItems = [...items];
        const editedItem = updatedItems[editingIndex];
        editedItem.name = itemName;
        editedItem.amount = parseFloat(itemAmount);
        editedItem.itemQuantity = parseInt(itemQuantity);
        setItems(updatedItems);
        setEditingIndex(null);
      } else {
        // Adding new item
        const newItem = { name: itemName, itemQuantity: parseInt(itemQuantity),amount: parseFloat(itemAmount) };
        const updatedItems = [...items, newItem]; 
        setItems(updatedItems);
      }

    const calculatedTotalAmount = calculateTotalAmount(items);
     setTotalAmount(calculatedTotalAmount); // Update total amount using the callback function
     setItemName('');
     setItemAmount('');
     setItemQuantity('1');
    }
  };

  const handleEditItem = (index) => {
    const itemToEdit = items[index];
    setItemName(itemToEdit.name);
    setItemQuantity(itemToEdit.itemQuantity);
    setItemAmount(itemToEdit.amount.toString());
    setEditingIndex(index);
  };

  const handleDeleteItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    const calculatedTotalAmount = calculateTotalAmount(updatedItems);
    setTotalAmount(calculatedTotalAmount);
  };

  const calculateTotalAmount = (items) => {
    return items.reduce((total, item) => total + item.amount * item.itemQuantity, 0);
  };


  const formatAmountWithCommas = (amount) => {
    return amount.toLocaleString();
  };


  const handleConfirmation = () => {
    const calculatedTotalAmount = calculateTotalAmount(items);
    setTotalAmount(calculatedTotalAmount); // 合計金額を更新
    navigate('/result', { state: { totalAmount: calculatedTotalAmount, inputItems: items, customerName, remarks } });
  };

  return (
    <div>
     <div className='app'>
       <div className='main'>
      <h1>見積書作成</h1>
       <div>
         <h2>買取項目入力</h2>
         <div className='inputForm'>
          <div className='customer-input'>
          <label>お客様の名前：</label>
          <input type="text" value={customerName} onChange={handleCustomerNameChange} />
        </div>
        <div className='border-line'></div>
         </div>
         <div className='item-input'>
         {items.map((item, index) => (
          <div key={index}>
            <p>{item.name}: {item.itemQuantity}個 :{formatAmountWithCommas(item.amount * item.itemQuantity)}円
            <button className='editButton' onClick={() => handleEditItem(index)}>編集</button>
            <button className='deleteButton' onClick={() => handleDeleteItem(index)}>削除</button>
        </p>
          </div>
        ))}
        <div className='inputForm'>
          <label>品物名: </label>
          <input type="text" value={itemName} onChange={handleItemNameChange} />
    
          <label>個数: </label>
          <input type="number" value={itemQuantity} onChange={handleItemQuantityChange} />
          <label>金額: </label>
          <input type="number" value={itemAmount} onChange={handleItemAmountChange} />
        </div>
        <p className='inputForm'>
        <button  onClick={handleAddItem} className='addButton'>{editingIndex !== null ? '項目編集' : '項目追加'}</button>
        </p>
      
        <h3 className='total-amount'>合計金額：  {formatAmountWithCommas(calculateTotalAmount(items))}円</h3>
        </div>
      </div>
      <div className='remark-position'>
      <label>備考</label>
      <div>
      <textarea value={remarks} onChange={handleRemarksChange}   rows="2" cols="100"/>
      </div>
      </div>

      <div className='border-line'></div>
      <button onClick={handleConfirmation} className='confirmButton'>確定</button>
    
      </div>
      
    </div>
    </div>
  );
}

  function ResultPage(){
  const location = useLocation();
  const inputItems = location && location.state ? location.state.inputItems : [];
  const totalAmount = location && location.state ? location.state.totalAmount : 0;
  const itemQuantity = location && location.state ? location.state.itemQuantity : 1;
  const customerName = location && location.state ? location.state.customerName : '   ';
  const remarks = location && location.state ? location.state.remarks : '';

  return (
    <div className='purchase'>
      <h1 className='purchase-title'>買取査定書</h1>
      <h2 className='purchase-total-amount'>お見積もり金額 ¥{totalAmount.toLocaleString()}</h2>
   
     <div className='text'>
   
      Nextus株式会社<br/>
      世田谷店店長 藤井　翔午<br/>
      〒157-0065<br/>
       東京都世田谷区上祖師谷6-29-4-1F<br/>
      TEL: 03-6877-1359<br />
      </div>

      <h2 className='customer-name'>{customerName} 様</h2>
      <table className='amount-table'>
        <thead className='table-head'>
          <tr>
            <th className='product-name'>品番</th>
            <th className='quantity'>数量</th>
            <th className='valuation-value'>査定額</th>
          </tr>
        </thead>
        <tbody>
          {inputItems && inputItems.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <th>{item.itemQuantity}</th>
              <td className='valuation-price'>¥{item.amount.toLocaleString()}</td>
            </tr>
          ))}
             <tr>
              <td className='white-border'></td>
             <td className='black-border' >合計額</td>
           <td className='valuation-price'>¥{totalAmount.toLocaleString()}</td>
    </tr>
        </tbody>
      </table>
     <div className='remark-text'>
      備考：
      {remarks}
     </div>

    </div>
  );
}

function App() {
  const [totalAmount, setTotalAmount] = useState(0);
  
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<MainPage totalAmount={totalAmount} setTotalAmount={setTotalAmount}  />} />
        <Route path="/result" element={<ResultPage totalAmount={totalAmount} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
