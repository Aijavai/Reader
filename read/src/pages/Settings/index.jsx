import React from 'react';
import { NavBar, Cell, Slider, ActionSheet, Toast } from 'react-vant';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import ThemeSwitch from '../../components/ThemeSwitch';
import './index.css';

const Settings = () => {
  const navigate = useNavigate();
  const { 
    fontSize, 
    setFontSize, 
    searchHistory, 
    clearSearchHistory,
    readingHistory,
    bookshelfBooks 
  } = useAppStore();
  
  const [showFontSheet, setShowFontSheet] = React.useState(false);
  const [showClearSheet, setShowClearSheet] = React.useState(false);
  
  const fontSizes = [
    { label: '小', value: 14 },
    { label: '标准', value: 16 },
    { label: '大', value: 18 },
    { label: '超大', value: 20 }
  ];
  
  const clearActions = [
    { name: '清除搜索历史', action: 'search' },
    { name: '清除阅读历史', action: 'reading' },
    { name: '清除全部数据', action: 'all', color: '#ee0a24' },
    { name: '取消', color: '#969799' }
  ];
  
  const handleFontSizeChange = (size) => {
    setFontSize(size);
    setShowFontSheet(false);
    Toast.success(`字体大小已设置为${fontSizes.find(f => f.value === size)?.label}`);
  };
  
  const handleClearData = (action) => {
    setShowClearSheet(false);
    
    switch (action) {
      case 'search':
        clearSearchHistory();
        Toast.success('搜索历史已清除');
        break;
      case 'reading':
        // 这里可以添加清除阅读历史的逻辑
        Toast.success('阅读历史已清除');
        break;
      case 'all':
        clearSearchHistory();
        // 清除其他数据
        Toast.success('所有数据已清除');
        break;
    }
  };
  
  return (
    <div className="settings-page">
      <NavBar
        title="设置"
        leftText="返回"
        onClickLeft={() => navigate(-1)}
      />
      
      <div className="settings-content">
        {/* 阅读设置 */}
        <div className="settings-section">
          <div className="section-title">阅读设置</div>
          
          <Cell.Group>
            <Cell
              title="字体大小"
              value={fontSizes.find(f => f.value === fontSize)?.label || '标准'}
              isLink
              onClick={() => setShowFontSheet(true)}
            />
            
            <Cell title="夜间模式">
              <ThemeSwitch showLabel={false} />
            </Cell>
          </Cell.Group>
        </div>
        
        {/* 数据管理 */}
        <div className="settings-section">
          <div className="section-title">数据管理</div>
          
          <Cell.Group>
            <Cell
              title="搜索历史"
              value={`${searchHistory.length}条记录`}
              isLink
              onClick={() => setShowClearSheet(true)}
            />
            
            <Cell
              title="阅读历史"
              value={`${readingHistory.length}条记录`}
              isLink
            />
            
            <Cell
              title="书架书籍"
              value={`${bookshelfBooks.length}本书`}
              isLink
            />
          </Cell.Group>
        </div>
        
        {/* 关于应用 */}
        <div className="settings-section">
          <div className="section-title">关于</div>
          
          <Cell.Group>
            <Cell
              title="版本信息"
              value="v1.0.0"
            />
            
            <Cell
              title="意见反馈"
              isLink
            />
            
            <Cell
              title="隐私政策"
              isLink
            />
          </Cell.Group>
        </div>
      </div>
      
      {/* 字体大小选择 */}
      <ActionSheet
        visible={showFontSheet}
        onCancel={() => setShowFontSheet(false)}
        title="选择字体大小"
        actions={fontSizes.map(font => ({
          name: font.label,
          callback: () => handleFontSizeChange(font.value)
        }))}
      />
      
      {/* 清除数据确认 */}
      <ActionSheet
        visible={showClearSheet}
        onCancel={() => setShowClearSheet(false)}
        title="数据管理"
        actions={clearActions.map(action => ({
          name: action.name,
          color: action.color,
          callback: () => action.action && handleClearData(action.action)
        }))}
      />
    </div>
  );
};

export default Settings;