
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate, useLocation} from 'react-router-dom';
import './App.css';

function MainPage({totalAmount, setTotalAmount}) {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState('1');
  const [itemAmount, setItemAmount] = useState('');
  const [salesRepName, setSalesRepName] = useState('');
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

  const handleSalesRepNameChange = (e) => {
    setSalesRepName(e.target.value);
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
    navigate('/result', { state: { totalAmount: calculatedTotalAmount, inputItems: items, salesRepName, remarks } });
  };

  return (
    <div>
     <div className='app'>
       <div className='main'>
      <h1>見積書作成</h1>
       <div>
         <div className='inputForm'>
          <div className='customer-input'>
          <label>担当者名：</label>
          <input type="text" value={salesRepName} onChange={handleSalesRepNameChange} />
        </div>
     
         </div>
         <div className='item-input'>
        <div className='inputForm'>
         <div> <label>品物名: </label>
          <input type="text" value={itemName} onChange={handleItemNameChange} />
    </div>
          <div><label>個数: </label>
          <input type="number" value={itemQuantity} onChange={handleItemQuantityChange} />
          </div>
         <div> <label>金額: </label>
          <input type="number" value={itemAmount} onChange={handleItemAmountChange} />
          </div>
        </div>
        <p className='inputForm'>
        <button  onClick={handleAddItem} className='addButton'>{editingIndex !== null ? '項目編集' : '項目追加'}</button>
        </p>
      
       
        </div>
      </div>

      <table className='item-table'>
          <thead>
            <tr>
              <th>品物名</th>
              <th>個数</th>
              <th>金額</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.itemQuantity}</td>
                <td>{formatAmountWithCommas(item.amount * item.itemQuantity)}円</td>
                <td>
                  <button className='editButton' onClick={() => handleEditItem(index)}>編集</button>
                  <button className='deleteButton' onClick={() => handleDeleteItem(index)}>削除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      <h3 className='total-amount'>合計金額：  {formatAmountWithCommas(calculateTotalAmount(items))}円</h3>
      
 
      <div className='remark-position'>
      <label>備考</label>
      <div>
      <textarea value={remarks} onChange={handleRemarksChange}   rows="2" cols="80"/>
      </div>
      </div>
 
      <button onClick={handleConfirmation} className='confirmButton'>見積書作成</button>
     

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
  const salesRepName = location && location.state ? location.state.salesRepName : '   ';
  const remarks = location && location.state ? location.state.remarks : '';

  return (
    <div className='purchase'>
      <h1 className='purchase-title'>買取明細書</h1>
      <div className='attention'>注意：この書面はよくお読み下さい</div>
   
   <table>
    <thead className='table-head'>
      <tr>
        <th>お客様ご記入欄</th></tr>
    </thead>
    <tbody>
      <tr>買取申込日　令和　　年　　　月　　　日</tr>
      <tr><td>氏名　　　　</td></tr>
      <tr><td>職業<div className='job'>会社員・自営・パート/アルバイト<br/>主婦・無職・学生<br/>その他（　　　　　　　）</div></td></tr>
    <tr><td>生年月日　　　　　　年　　月　　日（　　　）歳</td></tr>
    <tr><td>住所　　　　　　　　　　　　　　　　　　　<br/>
    　　　　　　　　　　　　　　　　　　　　　　　　　　<br/>
    　　　　　　　　　　　　　　　　　　　　　　　　　　<br/></td></tr>
    <tr><td>電話番号　　　　　</td></tr>
    <tr><td>本人確認書類<div className='identification'>運転免許証・保険証・その他（　　　　　）<br/>
   番号/記号（　　　　　　　　） </div></td></tr>
    </tbody>
   </table>
      

     <div className='text'>
   
      Nextus株式会社<br/>
      世田谷店店長 藤井　翔午<br/>
      〒157-0065<br/>
       東京都世田谷区上祖師谷6-29-4-1F<br/>
      TEL: 03-6877-1359<br />
<br/>
     担当者　{salesRepName}
      </div>

      <table className='amount-table'>
        <thead className='table-head'>
          <tr>
            <th className='product-name'>品名（特徴・形式・種類など）</th>
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
      買取の説明に同意した上で、上記の物品を譲渡し、「買取合計金額」に記載の金額を受領しました。< br/>
      <br/>
      令和　　　年　　　月　　　日　ご署名　　　　　　　　　　　様
      {remarks}
     </div>

     <div className='cooling-off-text'>
      クーリング・オフについて< br/>
      <br/>
      1 特定商取引法の適用を受ける場合には、お客様は購入業者による訪問購入を受け、この書面を受領した日から8日を経過するまでは、書面又は電磁的記録（電子メールやファックス等）により無条件で買取の撤回を行うこと（以下「クーリング・オフ」といいます）ができ、その効力は書面又は電磁的記録により通知を発したとき（書面は郵便消印日付、電磁的記録は送信日等）から生じます。右例のように必要事項を記載し、購入業者へ通知してください。（郵送の場合は簡易書留、内容証明郵便等にて行うことが望ましいです。電磁的記録の場合は下記クーリング・オフ受付メールアドレスへ電子メールで通知し、送信メール等は保存することが望ましいです。）<br/>
        ※ただし、特定商取引に関する法律施行令第16条の3で規定する物品（自動車・家電・家具・書籍・有価証券・レコード、CD、ゲーム　等）はクーリング・オフの適用外です。
      <br/>
      2 お客様がクーリング・オフをされる場合、購入業者より損害賠償及び違約金を請求されることはありません。すでに物品を引渡済みの場合は購入業者はすみやかに物品を返還し、お客様は代金を既に受け取っている場合は代金を返却することができます。また、物品の返還に必要な費用を請求されることはなく、代金の利息を返却する必要もありません。
      <br/>
      3 上記クーリング・オフの行使を妨げるために購入業者が不実のことを告げ、そのためお客様が誤認し、又は威迫により困惑してクーリング・オフを行われかった場合には、購入業者によりクーリング・オフ妨害の解消のための書面が交付され、その内容について説明を受けた日から8日を経過するまでは書面又は電磁的記録（電子メールやファックス等）によりクーリング・オフすることができます。<br/>
      4 購入業者は物品の引渡しを受けた後、クーリング・オフ期間内に第三者に物品を引き渡す場合は、お客様と第三者にその旨を通知します。また、クーリング・オフを行った場合、その効力は第三者にも及びます。ただし、第三者がクーリング・オフされる可能性があったことについて善意かつ無過失だった場合はこの限りではありません。
      <br/>
    <div className='cooling-off-mail'><span>クーリング・オフ受付メールアドレス：info@nextus.jp </span></div>  
      </div>
      <div className='warning'>【注意事項】</div>
      <div className="warning-note">
      当店ではブランド品・貴金属・その他物品に関し、模倣品等と疑わしきお品物の買取は一切お断りしております。<br/>
                お買取品が精巧かつ巧妙な模倣品の場合、たとえ当店の錯誤により売買契約（現金受け渡し、振り込み）が成立したとしてもその契約は不成立とし、後日当店より返金要求があった場合は、これに一切の意義を唱えず直ちに履行するものとします。< br/>
       ※お客様にご記入いただく個人情報は古物営業法に基づく記録として保管するもので、その他の目的では使用いたしません。
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
