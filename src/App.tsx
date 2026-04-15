import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  ChevronRight, 
  Settings as SettingsIcon,
  LayoutGrid,
  Edit2,
  X,
  Info,
  Trash,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Todo, Category, FilterType } from './types';
import { storage } from './lib/storage';

// --- Components ---

const IconButton = ({ icon: Icon, onClick, className = "" }: { icon: any, onClick?: (e?: React.MouseEvent) => void, className?: string }) => (
  <button 
    onClick={(e) => onClick?.(e)}
    className={`p-2.5 rounded-xl active:scale-90 transition-all hover:bg-white/10 ${className}`}
  >
    <Icon size={20} />
  </button>
);

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ 
  todo, 
  onToggle, 
  onDelete, 
  onEdit 
}) => {
  return (
    <div 
      className={`group relative flex items-center gap-4 p-4 glass rounded-2xl shadow-sm mb-4 cursor-pointer`}
      onClick={() => onEdit(todo)}
    >
      <button 
          onClick={(e) => { e.stopPropagation(); onToggle(todo.id); }}
          className={`transition-all shrink-0 p-1 rounded-lg ${todo.completed ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/40' : 'bg-slate-800/50 text-slate-600'}`}
        >
        {todo.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
      </button>
      
      <div className="flex-1 min-w-0">
        <p className={`text-base font-semibold transition-all ${todo.completed ? 'text-slate-500 line-through' : 'text-white'} whitespace-pre-wrap line-clamp-2`}>
          {todo.title}
        </p>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <IconButton icon={Edit2} onClick={(e) => { e?.stopPropagation(); onEdit(todo); }} className="text-indigo-400" />
        <IconButton icon={Trash2} onClick={(e) => { e?.stopPropagation(); onDelete(todo.id); }} className="text-pink-400" />
      </div>
    </div>
  );
};

// --- User Agreement & Privacy Policy Components ---

const PrivacyModal = ({ onAccept, onDecline, onOpenAgreement, onOpenPrivacy }: { 
  onAccept: () => void, 
  onDecline: () => void, 
  onOpenAgreement: () => void, 
  onOpenPrivacy: () => void 
}) => (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 z-120">
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="glass w-full max-w-sm shadow-2xl max-h-[80vh] overflow-y-auto rounded-[28px] border-white/10"
    >
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-6 text-center pt-4">
          用户协议与隐私政策
        </h3>
        <div className="mb-6">
          <p className="text-base text-slate-300 mb-3">(1)《隐私政策》中关于个人设备用户信息的收集和使用的说明。</p>
          <p className="text-base text-slate-300">(2)《隐私政策》中与第三方SDK类服务商数据共享、相关信息收集和使用说明。</p>
        </div>
        <div className="mb-6">
          <p className="text-sm text-slate-400 mb-2">用户协议和隐私政策说明：</p>
          <p className="text-sm text-slate-300">
            阅读完整的
            <span
              onClick={onOpenAgreement}
              className="text-indigo-400 hover:underline cursor-pointer font-medium"
            >
              《用户服务协议》
            </span>
            和
            <span
              onClick={onOpenPrivacy}
              className="text-indigo-400 hover:underline cursor-pointer font-medium"
            >
              《隐私政策》
            </span>
            了解详细内容。
          </p>
        </div>
      </div>
      <div className="flex border-t border-white/10">
        <button
          onClick={onDecline}
          className="flex-1 py-4 text-base font-medium text-slate-300 bg-white/5 border-r border-white/10 rounded-bl-[28px] hover:bg-white/10 transition-colors"
        >
          不同意
        </button>
        <button
          onClick={onAccept}
          className="flex-1 py-4 text-base font-medium text-white btn-gradient rounded-br-[28px] hover:bg-indigo-600 transition-colors"
        >
          同意并继续
        </button>
      </div>
    </motion.div>
  </div>
);

const AgreementModal = ({ onClose, title, content }: { onClose: () => void, title: string, content: any }) => (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 z-130">
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      className="glass rounded-[28px] w-full max-w-3xl h-[85vh] overflow-hidden shadow-2xl border border-white/10 flex flex-col"
    >
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-white/5 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center">
            <ShieldCheck size={22} />
          </div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-slate-400 active:scale-90 transition-transform hover:bg-white/10"
        >
          <X size={20} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto bg-white/5 p-6">
        {content}
      </div>
    </motion.div>
  </div>
);

const PrivacyPolicyContent = () => (
  <div className="max-w-none">
    <h1 className="text-2xl font-bold text-indigo-400 text-center mb-2">🔒 隐私政策</h1>
    <p className="text-center text-slate-400 mb-6"><strong>生效日期</strong>：2026年04月06日</p>

    <div className="bg-linear-to-r from-indigo-500/10 to-indigo-500/5 p-6 rounded-lg border-l-4 border-indigo-500 mb-6">
      <p className="text-slate-300">欢迎使用「简序清单」（以下简称"本应用"）。本应用由 光年跃迁（温州）科技有限公司 （以下简称"我们"）开发并运营。我们深知个人信息对您的重要性，将严格遵守《中华人民共和国个人信息保护法》等相关法律法规，保护您的个人信息安全。</p>
    </div>

    <p className="mb-6 text-slate-300">本隐私政策旨在说明我们如何收集、使用、存储和保护您在使用本应用过程中提供的个人信息，以及您对这些信息所享有的权利。请您在使用本应用前仔细阅读并充分理解本政策的全部内容，尤其是加粗的条款。如您对本政策有任何疑问、意见或建议，可通过本政策末尾提供的联系方式与我们联系。</p>

    <h2 className="text-xl font-semibold mt-8 mb-4 border-b-2 border-white/10 pb-2 text-slate-200">一、我们收集的信息</h2>
    <p className="mb-4 text-slate-300">在您使用本应用的过程中，我们会收集以下信息，以提供、维护和改进我们的服务：</p>
    <ol className="list-decimal pl-6 mb-6">
      <li className="mb-3 text-slate-300"><strong>待办事项数据</strong>：您在使用本应用过程中主动录入的所有<strong>任务内容、分类信息及相关数据</strong>。这些数据是本应用的核心功能内容，用于为您提供任务管理、分类管理和历史记录服务。</li>
      <li className="mb-3 text-slate-300"><strong>设备信息</strong>：为了保障应用的稳定运行和优化用户体验，我们会自动收集您的设备相关信息，包括但不限于<strong>设备型号、操作系统版本、设备标识符（如IMEI/Android ID）、IP地址</strong>等。</li>
    </ol>

    <h2 className="text-xl font-semibold mt-8 mb-4 border-b-2 border-white/10 pb-2 text-slate-200">二、我们如何使用收集的信息</h2>
    <p className="mb-4 text-slate-300">我们仅会在以下合法、正当、必要的范围内使用您的个人信息：</p>
    <ol className="list-decimal pl-6 mb-6">
      <li className="mb-3 text-slate-300"><strong>提供和改进服务</strong>：使用您的待办事项数据来实现任务管理、分类管理等核心功能；通过分析设备信息和使用数据，优化应用性能，修复已知问题，提升用户体验。</li>
      <li className="mb-3 text-slate-300"><strong>数据分析和统计</strong>：在对您的个人信息进行匿名化或去标识化处理后，进行内部数据分析和统计，以了解用户群体的使用习惯和需求，从而更好地规划和改进产品功能。</li>
    </ol>

    <h2 className="text-xl font-semibold mt-8 mb-4 border-b-2 border-white/10 pb-2 text-slate-200">三、我们如何共享、转让和公开披露信息</h2>
    <p className="mb-4 text-slate-300">我们郑重承诺，严格保护您的个人信息，不会在以下情形之外向任何第三方共享、转让或公开披露您的信息：</p>
    <ol className="list-decimal pl-6 mb-6">
      <li className="mb-3 text-slate-300"><strong>法定情形</strong>：根据法律法规的规定、行政或司法机关的强制性要求，我们可能会向有关部门披露您的相关信息。</li>
      <li className="mb-3 text-slate-300"><strong>获得明确同意</strong>：在获得您的明确书面同意后，我们才会向第三方共享您的个人信息。</li>
      <li className="mb-3 text-slate-300"><strong>业务必要且合规</strong>：为了实现本政策第二条所述的目的，我们可能会与提供技术支持、支付服务或其他必要服务的合作伙伴共享必要的信息，但我们会要求其严格遵守本政策及相关法律法规，并对您的信息承担保密义务。</li>
    </ol>

    <h2 className="text-xl font-semibold mt-8 mb-4 border-b-2 border-white/10 pb-2 text-slate-200">四、我们如何存储和保护信息</h2>
    <ol className="list-decimal pl-6 mb-6">
      <li className="mb-3 text-slate-300"><strong>存储地点和期限</strong>：您的个人信息将存储于中华人民共和国境内的安全服务器上。我们会在实现本政策所述目的所必需的最短时间内保留您的信息，超出此期限后，我们将对您的信息进行删除或匿名化处理。</li>
      <li className="mb-3 text-slate-300"><strong>安全措施</strong>：我们采用符合行业标准的技术手段和安全管理措施来保护您的个人信息，包括但不限于数据加密、访问控制、安全审计等，以防止信息泄露、丢失、篡改或被未经授权的访问。</li>
    </ol>

    <h2 className="text-xl font-semibold mt-8 mb-4 border-b-2 border-white/10 pb-2 text-slate-200">五、您的权利</h2>
    <p className="mb-4 text-slate-300">根据相关法律法规，您对您的个人信息享有以下权利：</p>
    <ol className="list-decimal pl-6 mb-6">
      <li className="mb-3 text-slate-300"><strong>访问权</strong>：您可以随时在本应用中查看和管理您的待办事项数据及历史记录。</li>
      <li className="mb-3 text-slate-300"><strong>更正权</strong>：如您发现您的待办事项数据存在错误，您可以在应用内进行修改和更正。</li>
      <li className="mb-3 text-slate-300"><strong>删除权</strong>：您可以随时删除单个任务或清空所有任务，应用将立即删除相关数据。</li>
      <li className="mb-3 text-slate-300"><strong>数据导出</strong>：本应用所有数据存储在您的设备本地，您可以通过设备备份等方式导出您的数据。</li>
    </ol>

    <h2 className="text-xl font-semibold mt-8 mb-4 border-b-2 border-white/10 pb-2 text-slate-200">六、未成年人保护</h2>
    <p className="mb-6 text-slate-300">我们非常重视对未成年人个人信息的保护。如您是未满14周岁的未成年人，在使用本应用前，应在监护人的指导下仔细阅读本政策，并征得监护人的同意。如我们发现自己在未事先获得监护人可验证同意的情况下收集了未成年人的个人信息，将立即删除相关数据。</p>

    <h2 className="text-xl font-semibold mt-8 mb-4 border-b-2 border-white/10 pb-2 text-slate-200">七、本政策的更新</h2>
    <p className="mb-6 text-slate-300">我们可能会根据法律法规的更新、业务的调整或技术的发展，适时对本隐私政策进行修订。修订后的政策将在本应用内显著位置公示，并在生效前通过合理方式通知您。如您继续使用本应用，即表示您同意接受修订后的政策。</p>

    <h2 className="text-xl font-semibold mt-8 mb-4 border-b-2 border-white/10 pb-2 text-slate-200">八、联系我们</h2>
    <p className="mb-4 text-slate-300">如您对本隐私政策有任何疑问、意见或建议，或需要行使您的相关权利，请通过以下方式与我们联系：</p>
    <div className="bg-white/5 p-4 rounded-lg border border-white/10 mb-6">
      <p className="mb-2 text-slate-300"><strong>电子邮箱</strong>：Jp112022@163.com</p>
    </div>

    <div className="mt-8 pt-6 border-t border-white/10 text-center">
      <p className="mb-2 text-slate-400">感谢您使用简序清单！</p>
      <p className="mb-4 text-slate-400">我们致力于为您提供安全、便捷的任务管理服务。</p>
      <p className="text-sm text-slate-500">© 2026 简序清单 版权所有</p>
    </div>
  </div>
);

const UserAgreementContent = () => (
  <div className="prose max-w-none">
    <h1 className="text-2xl font-bold text-indigo-400 text-center mb-4">用户服务协议</h1>
    <p className="text-center text-slate-400 mb-8">更新日期：2026年4月06日</p>
    
    <h2 className="text-xl font-semibold mt-8 mb-4 text-slate-200">1. 协议的接受</h2>
    <p className="text-slate-300">欢迎使用「简序清单」应用（以下简称「本应用」）。</p>
    <p className="text-slate-300">本协议是您与开发者之间关于使用本应用的法律协议。</p>
    <p className="text-slate-300">通过下载、安装或使用本应用，您表示同意接受本协议的全部条款和条件。</p>
    
    <h2 className="text-xl font-semibold mt-8 mb-4 text-slate-200">2. 服务内容</h2>
    <p className="text-slate-300">本应用提供以下服务：</p>
    <ul className="list-disc pl-6 space-y-2">
      <li className="text-slate-300">创建和管理待办事项</li>
      <li className="text-slate-300">创建和管理任务分类</li>
      <li className="text-slate-300">标记任务完成状态</li>
      <li className="text-slate-300">查看任务历史记录</li>
    </ul>
    
    <h2 className="text-xl font-semibold mt-8 mb-4 text-slate-200">3. 用户义务</h2>
    <p className="text-slate-300">作为本应用的用户，您同意：</p>
    <ul className="list-disc pl-6 space-y-2">
      <li className="text-slate-300">遵守本协议的所有条款</li>
      <li className="text-slate-300">不使用本应用进行任何非法活动</li>
      <li className="text-slate-300">不干扰本应用的正常运行</li>
      <li className="text-slate-300">保护您的设备安全，防止未授权访问</li>
    </ul>
    
    <h2 className="text-xl font-semibold mt-8 mb-4 text-slate-200">4. 知识产权</h2>
    <p className="text-slate-300">本应用的所有内容，包括但不限于文字、图像、音频、视频、软件等，均受知识产权法律保护。</p>
    <p className="text-slate-300">未经我们的书面许可，您不得复制、修改、分发或商业使用本应用的任何内容。</p>
    
    <h2 className="text-xl font-semibold mt-8 mb-4 text-slate-200">5. 免责声明</h2>
    <p className="text-slate-300">本应用按「原样」提供，不做任何形式的保证。</p>
    <p className="text-slate-300">我们不保证：</p>
    <ul className="list-disc pl-6 space-y-2">
      <li className="text-slate-300">本应用将符合您的要求</li>
      <li className="text-slate-300">本应用将无中断、及时、安全或无错误地运行</li>
      <li className="text-slate-300">本应用的使用结果将是准确或可靠的</li>
    </ul>
    
    <h2 className="text-xl font-semibold mt-8 mb-4 text-slate-200">6. 终止</h2>
    <p className="text-slate-300">我们有权在任何时候，出于任何原因，终止或暂停您对本应用的访问。</p>
    <p className="text-slate-300">您也可以随时停止使用本应用。</p>
    
    <h2 className="text-xl font-semibold mt-8 mb-4 text-slate-200">7. 适用法律</h2>
    <p className="text-slate-300">本协议受中华人民共和国法律管辖。</p>
    <p className="text-slate-300">任何与本协议相关的争议，应通过友好协商解决；协商不成的，应提交至有管辖权的人民法院诉讼解决。</p>
  </div>
);

// --- Main App ---

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<'home' | 'categories' | 'settings'>('home');
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  
  // Agreement & Privacy Policy states
  const [isAgreementAccepted, setIsAgreementAccepted] = useState<boolean | null>(null);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState<string | null>(null); // 'user' or 'privacy'
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isMarkAllModalOpen, setIsMarkAllModalOpen] = useState(false);
  const [isClearCompletedModalOpen, setIsClearCompletedModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isCategoryDeleteModalOpen, setIsCategoryDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoCategory, setNewTodoCategory] = useState('work');

  // Load data and check agreement status
  useEffect(() => {
    // Check if user has already accepted the agreement
    const agreementStatus = localStorage.getItem('agreementAccepted');
    if (agreementStatus === 'true') {
      setIsAgreementAccepted(true);
      // Load data only if agreement is accepted
      setTodos(storage.getTodos());
      
      // Get categories and remove duplicates
      const categoriesData = storage.getCategories();
      const uniqueCategories = Array.from(new Map(categoriesData.map((cat: Category) => [cat.id, cat])).values());
      setCategories(uniqueCategories);
    } else {
      // Show privacy modal if agreement not accepted
      setShowPrivacyModal(true);
    }
  }, []);

  // Save data
  useEffect(() => {
    storage.saveTodos(todos);
  }, [todos]);

  useEffect(() => {
    storage.saveCategories(categories);
  }, [categories]);

  // Agreement & Privacy Policy handlers
  const handleAcceptAgreement = () => {
    setIsAgreementAccepted(true);
    setShowPrivacyModal(false);
    localStorage.setItem('agreementAccepted', 'true');
    // Load data after agreement is accepted
    setTodos(storage.getTodos());
    setCategories(storage.getCategories());
  };

  const handleDeclineAgreement = () => {
    setShowDeclineModal(true);
  };

  const handleDeclineCancel = () => {
    setShowDeclineModal(false);
  };

  const handleDeclineConfirm = () => {
    setShowDeclineModal(false);
    setShowPrivacyModal(false);
    // For now, we'll just close the modal, but in a real app, you might want to exit the app
  };

  const handleOpenUserAgreement = () => {
    setShowAgreementModal('user');
  };

  const handleOpenPrivacyPolicy = () => {
    setShowAgreementModal('privacy');
  };

  const handleCloseAgreementModal = () => {
    setShowAgreementModal(null);
  };

  const handleAddTodo = () => {
    if (!newTodoTitle.trim()) return;
    
    if (editingTodo) {
      setTodos(todos.map(t => t.id === editingTodo.id ? {
        ...t,
        title: newTodoTitle,
        note: '',
        categoryId: newTodoCategory
      } : t));
    } else {
      const newTodo: Todo = {
        id: Date.now().toString(),
        title: newTodoTitle,
        note: '',
        completed: false,
        categoryId: newTodoCategory,
        createdAt: Date.now(),
      };
      setTodos([newTodo, ...todos]);
    }
    
    closeModal();
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setEditingTodo(null);
    setNewTodoTitle('');
    setNewTodoCategory('work');
  };

  const openEditModal = (todo: Todo) => {
    setEditingTodo(todo);
    // Merge title and note for editing if note exists
    const mergedContent = todo.note ? `${todo.title}\n${todo.note}` : todo.title;
    setNewTodoTitle(mergedContent);
    setNewTodoCategory(todo.categoryId);
    setIsAddModalOpen(true);
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(t => !t.completed));
  };

  const markAllCompleted = () => {
    setTodos(todos.map(t => ({ ...t, completed: true })));
  };

  const filteredTodos = todos
    .filter(t => {
      const categoryMatch = selectedCategoryId === 'all' || t.categoryId === selectedCategoryId;
      const statusMatch = filter === 'all' || (filter === 'todo' && !t.completed) || (filter === 'completed' && t.completed);
      return categoryMatch && statusMatch;
    })
    .sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return b.createdAt - a.createdAt;
    });

  const renderHome = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="px-6 pt-14 pb-1">
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col">
            <h1 className="text-2xl font-display font-bold text-gradient">简序清单</h1>
            <p className="text-slate-500 text-[9px] font-bold uppercase tracking-[0.2em] mt-0.5">Simple Order List</p>
          </div>
          <div className="w-8 h-8 rounded-lg btn-gradient flex items-center justify-center glow">
            <CheckCircle2 size={16} />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2.5">
          <button 
            onClick={() => setSelectedCategoryId('all')}
            className={`px-3.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap ${selectedCategoryId === 'all' ? 'btn-gradient glow' : 'bg-slate-800/40 text-slate-400 hover:bg-slate-800/60'}`}
          >
            全部分类
          </button>
          {categories.filter(c => c.id !== 'all').map(cat => (
            <button 
              key={cat.id}
              onClick={() => setSelectedCategoryId(cat.id)}
              className={`px-3.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap ${selectedCategoryId === cat.id ? 'btn-gradient glow' : 'bg-slate-800/40 text-slate-400 hover:bg-slate-800/60'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex gap-3 mt-3">
          {(['all', 'todo', 'completed'] as FilterType[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold ${filter === f ? 'btn-gradient glow' : 'bg-slate-800/40 text-slate-400 hover:bg-slate-800/60'}`}
            >
              {f === 'all' ? '全部' : f === 'todo' ? '待办' : '已完成'}
            </button>
          ))}
        </div>
      </header>

      {/* List */}
      <main className="flex-1 overflow-y-auto px-6 pb-32 pt-2">
        {filteredTodos.length > 0 ? (
          filteredTodos.map(todo => (
            <TodoItem 
              key={todo.id} 
              todo={todo} 
              onToggle={toggleTodo} 
              onDelete={deleteTodo}
              onEdit={openEditModal}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-80 text-slate-600">
            <div className="w-24 h-24 glass rounded-full flex items-center justify-center mb-6 glow">
              <CheckCircle2 size={48} className="text-indigo-400/50" />
            </div>
            <p className="text-lg font-display font-medium text-slate-300">开启高效的一天</p>
            <p className="text-sm opacity-60 mt-2">点击下方按钮添加新任务</p>
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-28 right-6 w-16 h-16 btn-gradient rounded-3xl shadow-2xl flex items-center justify-center z-10 glow"
      >
        <Plus size={32} strokeWidth={3} />
      </motion.button>
    </div>
  );

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    
    // Generate a unique id for the new category
    const newId = Date.now().toString();
    
    // Check if category name already exists
    const categoryExists = categories.some(cat => cat.name === newCategoryName.trim());
    if (categoryExists) {
      alert('分类名称已存在，请使用其他名称');
      return;
    }
    
    setCategories([...categories, { id: newId, name: newCategoryName.trim() }]);
    setNewCategoryName('');
    setIsCategoryModalOpen(false);
  };

  const handleDeleteCategory = () => {
    if (!categoryToDelete) return;
    setCategories(categories.filter(c => c.id !== categoryToDelete.id));
    // Also update todos that were in this category to 'work' (default)
    setTodos(todos.map(t => t.categoryId === categoryToDelete.id ? { ...t, categoryId: 'work' } : t));
    setCategoryToDelete(null);
    setIsCategoryDeleteModalOpen(false);
  };

  const renderCategories = () => (
    <div className="p-6 h-full overflow-y-auto pb-32 pt-16">
      <h2 className="text-3xl font-display font-bold text-gradient mb-8">分类管理</h2>
      <div className="grid grid-cols-1 gap-4">
        {categories.filter(c => c.id !== 'all').map(cat => (
          <div 
            key={cat.id} 
            className="flex items-center justify-between p-5 glass rounded-3xl shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <LayoutGrid size={20} />
              </div>
              <span className="font-bold text-slate-200">{cat.name}</span>
            </div>
            {!cat.isDefault && (
              <button 
                onClick={() => {
                  setCategoryToDelete(cat);
                  setIsCategoryDeleteModalOpen(true);
                }} 
                className="text-pink-400 p-2 hover:bg-pink-500/10 rounded-xl transition-colors"
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>
        ))}
        <button 
          onClick={() => setIsCategoryModalOpen(true)}
          className="w-full p-6 border-2 border-dashed border-indigo-500/20 rounded-3xl text-indigo-400 flex items-center justify-center gap-3 hover:bg-indigo-500/5 transition-all font-bold"
        >
          <Plus size={24} /> 添加新分类
        </button>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="p-6 h-full overflow-y-auto pb-32 pt-16">
      <h2 className="text-3xl font-display font-bold text-gradient mb-8">设置中心</h2>
      
      <div className="space-y-8">
        <section>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 ml-2">数据管理</h3>
          <div className="glass rounded-4xl overflow-hidden shadow-sm">
            <button onClick={() => setIsMarkAllModalOpen(true)} className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors border-b border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 size={20} />
                </div>
                <span className="font-bold text-slate-200">全部标为已完成</span>
              </div>
              <ChevronRight size={20} className="text-slate-600" />
            </button>
            <button onClick={() => setIsClearCompletedModalOpen(true)} className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors border-b border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <Trash size={20} />
                </div>
                <span className="font-bold text-slate-200">清空已完成</span>
              </div>
              <ChevronRight size={20} className="text-slate-600" />
            </button>
            <button 
              onClick={() => setIsConfirmModalOpen(true)} 
              className="w-full flex items-center justify-between p-6 hover:bg-pink-500/10 transition-colors text-pink-400"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-pink-500/10 flex items-center justify-center">
                  <Trash2 size={20} />
                </div>
                <span className="font-bold">重置所有数据</span>
              </div>
              <ChevronRight size={20} className="opacity-50" />
            </button>
          </div>
        </section>

        <section>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 ml-2">关于应用</h3>
          <div className="glass rounded-4xl p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16" />
            <div className="flex items-center gap-5 mb-6">
              <div className="w-16 h-16 btn-gradient rounded-[1.25rem] flex items-center justify-center text-white font-bold text-2xl shadow-xl shadow-indigo-500/20 glow">
                简
              </div>
              <div>
                <h4 className="text-xl font-display font-bold text-white">简序清单</h4>
                <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mt-1">V1.0</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">
              简序清单是一款面向未来的极简待办工具。我们坚持“纯净、离线、高效”的原则，为您提供最纯粹的任务管理体验。
            </p>
            <button 
              onClick={handleOpenPrivacyPolicy}
              className="mt-6 flex items-center gap-2 text-indigo-400 font-bold text-sm hover:text-indigo-300 transition-colors cursor-pointer"
            >
              <Info size={16} />
              <span>隐私政策</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col relative overflow-hidden font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[40%] bg-pink-500/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute top-[30%] right-[-20%] w-[50%] h-[30%] bg-purple-500/10 blur-[100px] rounded-full -z-10" />
      
      {/* Content Area */}
      {isAgreementAccepted && (
        <>
          <div className="flex-1 overflow-hidden">
            <div
              key={activeTab}
              className="h-full"
            >
              {activeTab === 'home' && renderHome()}
              {activeTab === 'categories' && renderCategories()}
              {activeTab === 'settings' && renderSettings()}
            </div>
          </div>

          {/* Bottom Navigation */}
          <nav className="h-24 px-8 pb-6 pt-2">
            <div className="glass h-full rounded-4xl flex items-center justify-around px-4 shadow-2xl border-white/10">
              <button 
                onClick={() => setActiveTab('home')}
                className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'home' ? 'text-indigo-400 scale-110' : 'text-slate-500 opacity-60'}`}
              >
                <div className={`p-2 rounded-xl ${activeTab === 'home' ? 'bg-indigo-500/20' : ''}`}>
                  <CheckCircle2 size={24} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest">清单</span>
              </button>
              <button 
                onClick={() => setActiveTab('categories')}
                className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'categories' ? 'text-indigo-400 scale-110' : 'text-slate-500 opacity-60'}`}
              >
                <div className={`p-2 rounded-xl ${activeTab === 'categories' ? 'bg-indigo-500/20' : ''}`}>
                  <LayoutGrid size={24} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest">分类</span>
              </button>
              <button 
                onClick={() => setActiveTab('settings')}
                className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'settings' ? 'text-indigo-400 scale-110' : 'text-slate-500 opacity-60'}`}
              >
                <div className={`p-2 rounded-xl ${activeTab === 'settings' ? 'bg-indigo-500/20' : ''}`}>
                  <SettingsIcon size={24} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest">设置</span>
              </button>
            </div>
          </nav>
        </>
      )}

      {/* Agreement & Privacy Policy Modals */}
      <AnimatePresence>
        {showPrivacyModal && (
          <PrivacyModal
            onAccept={handleAcceptAgreement}
            onDecline={handleDeclineAgreement}
            onOpenAgreement={handleOpenUserAgreement}
            onOpenPrivacy={handleOpenPrivacyPolicy}
          />
        )}

        {showAgreementModal && (
          <AgreementModal
            onClose={handleCloseAgreementModal}
            title={showAgreementModal === 'user' ? '用户服务协议' : '隐私政策'}
            content={showAgreementModal === 'user' ? <UserAgreementContent /> : <PrivacyPolicyContent />}
          />
        )}

        {showDeclineModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 z-140"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass rounded-[28px] w-full max-w-md overflow-hidden shadow-2xl border border-white/10 flex flex-col"
            >
              <div className="flex-1 p-6">
                <h2 className="text-xl font-bold text-white mb-4">确认拒绝</h2>
                <p className="text-slate-300 mb-6">您确定要拒绝隐私政策吗？拒绝后将无法使用我们的服务。</p>
              </div>
              <div className="flex border-t border-white/10">
                <button
                  onClick={handleDeclineCancel}
                  className="flex-1 py-4 text-center text-slate-300 font-medium hover:bg-white/10"
                >
                  取消
                </button>
                <div className="w-px bg-white/10"></div>
                <button
                  onClick={handleDeclineConfirm}
                  className="flex-1 py-4 text-center text-indigo-400 font-medium hover:bg-white/10"
                >
                  确定
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-md glass rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 shadow-2xl border-white/10"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-display font-bold text-white">{editingTodo ? '编辑任务' : '开启新任务'}</h2>
                <IconButton icon={X} onClick={closeModal} className="bg-white/5 text-slate-400" />
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-2 block ml-1">任务内容</label>
                  <textarea 
                    autoFocus
                    value={newTodoTitle}
                    onChange={(e) => setNewTodoTitle(e.target.value)}
                    placeholder="今天要做什么？"
                    rows={4}
                    className="w-full bg-white/5 border-2 border-transparent focus:border-indigo-500/40 focus:bg-white/10 rounded-2xl p-5 text-base font-semibold outline-none transition-all resize-none text-white placeholder:text-slate-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-2 block ml-1">所属分类</label>
                  <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                    {categories.filter(c => c.id !== 'all').map(cat => (
                      <button 
                        key={cat.id}
                        onClick={() => setNewTodoCategory(cat.id)}
                        className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${newTodoCategory === cat.id ? 'btn-gradient shadow-md glow' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={handleAddTodo}
                  disabled={!newTodoTitle.trim()}
                  className="w-full py-5 btn-gradient rounded-2xl font-bold text-lg active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 mt-6 shadow-xl glow"
                >
                  {editingTodo ? '保存修改' : '立即开启'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Modal */}
      <AnimatePresence>
        {isCategoryModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-60 flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm glass rounded-4xl p-8 shadow-2xl border-white/10"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-display font-bold text-white">添加新分类</h2>
                <IconButton icon={X} onClick={() => setIsCategoryModalOpen(false)} className="bg-white/5 text-slate-400" />
              </div>
              <input 
                autoFocus
                type="text" 
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="分类名称"
                className="w-full bg-white/5 border-2 border-transparent focus:border-indigo-500/40 focus:bg-white/10 rounded-2xl p-4 text-base font-semibold outline-none transition-all text-white placeholder:text-slate-600 mb-6"
                onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
              />
              <button 
                onClick={handleAddCategory}
                disabled={!newCategoryName.trim()}
                className="w-full py-4 btn-gradient rounded-2xl font-bold text-base active:scale-95 transition-all disabled:opacity-50 glow"
              >
                确认添加
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Modal */}
      <AnimatePresence>
        {isConfirmModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-70 flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm glass rounded-4xl p-8 shadow-2xl border-white/10 text-center"
            >
              <div className="w-16 h-16 bg-pink-500/10 text-pink-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 size={32} />
              </div>
              <h2 className="text-xl font-display font-bold text-white mb-2">确定要重置吗？</h2>
              <p className="text-sm text-slate-400 mb-8 leading-relaxed">此操作将清空所有任务和分类，且不可撤销。请谨慎操作。</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsConfirmModalOpen(false)}
                  className="flex-1 py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-bold text-slate-300 transition-all"
                >
                  取消
                </button>
                <button 
                  onClick={() => {
                    storage.clearAll();
                    window.location.reload();
                  }}
                  className="flex-1 py-4 bg-pink-500 hover:bg-pink-600 rounded-2xl font-bold text-white transition-all shadow-lg shadow-pink-500/20"
                >
                  确定重置
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Delete Confirm Modal */}
      <AnimatePresence>
        {isCategoryDeleteModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-70 flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm glass rounded-4xl p-8 shadow-2xl border-white/10 text-center"
            >
              <div className="w-16 h-16 bg-pink-500/10 text-pink-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <LayoutGrid size={32} />
              </div>
              <h2 className="text-xl font-display font-bold text-white mb-2">删除分类？</h2>
              <p className="text-sm text-slate-400 mb-8 leading-relaxed">
                确定要删除分类 <span className="text-indigo-400 font-bold">"{categoryToDelete?.name}"</span> 吗？<br/>
                该分类下的任务将自动移至默认分类。
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsCategoryDeleteModalOpen(false)}
                  className="flex-1 py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-bold text-slate-300 transition-all"
                >
                  取消
                </button>
                <button 
                  onClick={handleDeleteCategory}
                  className="flex-1 py-4 bg-pink-500 hover:bg-pink-600 rounded-2xl font-bold text-white transition-all shadow-lg shadow-pink-500/20"
                >
                  确定删除
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mark All Completed Confirm Modal */}
      <AnimatePresence>
        {isMarkAllModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-70 flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm glass rounded-4xl p-8 shadow-2xl border-white/10 text-center"
            >
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-xl font-display font-bold text-white mb-2">全部标为已完成？</h2>
              <p className="text-sm text-slate-400 mb-8 leading-relaxed">确定要将所有待办事项标记为已完成吗？</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsMarkAllModalOpen(false)}
                  className="flex-1 py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-bold text-slate-300 transition-all"
                >
                  取消
                </button>
                <button 
                  onClick={() => {
                    markAllCompleted();
                    setIsMarkAllModalOpen(false);
                  }}
                  className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 rounded-2xl font-bold text-white transition-all shadow-lg shadow-emerald-500/20"
                >
                  确定标记
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clear Completed Confirm Modal */}
      <AnimatePresence>
        {isClearCompletedModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-70 flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm glass rounded-4xl p-8 shadow-2xl border-white/10 text-center"
            >
              <div className="w-16 h-16 bg-amber-500/10 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash size={32} />
              </div>
              <h2 className="text-xl font-display font-bold text-white mb-2">清空已完成？</h2>
              <p className="text-sm text-slate-400 mb-8 leading-relaxed">确定要永久删除所有已完成的任务吗？此操作不可撤销。</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsClearCompletedModalOpen(false)}
                  className="flex-1 py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-bold text-slate-300 transition-all"
                >
                  取消
                </button>
                <button 
                  onClick={() => {
                    clearCompleted();
                    setIsClearCompletedModalOpen(false);
                  }}
                  className="flex-1 py-4 bg-amber-500 hover:bg-amber-600 rounded-2xl font-bold text-white transition-all shadow-lg shadow-amber-500/20"
                >
                  确定清空
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Privacy Policy Modal */}
      <AnimatePresence>
        {isPrivacyModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-80 flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md glass rounded-4xl p-8 shadow-2xl border-white/10"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-display font-bold text-white">隐私政策</h2>
                <IconButton icon={X} onClick={() => setIsPrivacyModalOpen(false)} className="bg-white/5 text-slate-400" />
              </div>
              <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar space-y-6">
                <section>
                  <h3 className="text-indigo-400 font-bold text-sm mb-2 uppercase tracking-wider">数据存储</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    简序清单是一款完全离线的应用。您的所有任务、分类和设置数据均仅存储在您设备的本地浏览器缓存（LocalStorage）中。我们不会将您的任何数据上传到云端或任何第三方服务器。
                  </p>
                </section>
                <section>
                  <h3 className="text-indigo-400 font-bold text-sm mb-2 uppercase tracking-wider">个人信息收集</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    我们不会收集您的姓名、邮箱、电话号码或任何其他个人身份信息。应用无需注册或登录即可使用。
                  </p>
                </section>
                <section>
                  <h3 className="text-indigo-400 font-bold text-sm mb-2 uppercase tracking-wider">第三方服务</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    本应用不包含任何第三方广告、追踪器或分析工具。您的使用行为不会被任何外部机构监控。
                  </p>
                </section>
                <section>
                  <h3 className="text-indigo-400 font-bold text-sm mb-2 uppercase tracking-wider">数据安全</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    由于数据存储在本地，其安全性取决于您对设备的物理控制和浏览器安全设置。如果您清除浏览器缓存或更换设备，数据将会丢失。建议您定期手动备份重要信息。
                  </p>
                </section>
              </div>
              <button 
                onClick={() => setIsPrivacyModalOpen(false)}
                className="w-full py-4 mt-8 btn-gradient rounded-2xl font-bold text-base active:scale-95 transition-all glow"
              >
                我已了解
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
