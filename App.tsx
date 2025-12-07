import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Header } from './components/Header';
import { FeatureCard } from './components/FeatureCard';
import { FooterNav } from './components/FooterNav';
import { Button } from './components/Button';
import { 
  HomeIcon, PlayerIcon, WorldIcon, AdventureIcon, CastleIcon, 
  MapIcon, SparklesIcon, BackpackIcon, CloseIcon, SwordsIcon, 
  EditIcon, DeleteIcon, ChevronDownIcon, SendIcon
} from './constants';
import type { NavItem, FeatureListItem, GeneratedItem, World, Character, AdventureMessage, ViewMode, AdventureLogCollection } from './types';
import { geminiService } from './services/geminiService';

const AppInstance: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewMode>('home');
  
  // Game State
  const [worlds, setWorlds] = useState<World[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [adventureLogs, setAdventureLogs] = useState<AdventureLogCollection>({});
  
  const [currentWorld, setCurrentWorld] = useState<World | null>(null);
  const [currentCharacter, setCurrentCharacter] = useState<Character | null>(null);
  
  // For managing edits and selections
  const [selectedWorldForManagement, setSelectedWorldForManagement] = useState<World | null>(null);
  const [editingWorld, setEditingWorld] = useState<World | null>(null);
  const [editingItem, setEditingItem] = useState<GeneratedItem | null>(null);

  // Inputs
  const [userWorldDescInput, setUserWorldDescInput] = useState<string>('');
  const [editWorldNameInput, setEditWorldNameInput] = useState<string>('');
  const [editWorldDescInput, setEditWorldDescInput] = useState<string>('');
  
  const [guidedWorldGenreInput, setGuidedWorldGenreInput] = useState<string>('فانتزی حماسی');
  const [guidedWorldSuggestedNameInput, setGuidedWorldSuggestedNameInput] = useState<string>('');
  const [guidedWorldUserDescInput, setGuidedWorldUserDescInput] = useState<string>('');

  const [characterNameInput, setCharacterNameInput] = useState<string>('');
  const [characterAgeInput, setCharacterAgeInput] = useState<string>('');
  const [characterClassInput, setCharacterClassInput] = useState<string>('');
  const [characterRaceInput, setCharacterRaceInput] = useState<string>('');
  const [characterUserDescInput, setCharacterUserDescInput] = useState<string>('');

  const [itemNameInput, setItemNameInput] = useState<string>('');
  const [adventureInput, setAdventureInput] = useState<string>('');
  
  const [editItemNameInput, setEditItemNameInput] = useState<string>('');
  const [editItemRankInput, setEditItemRankInput] = useState<string>('');
  const [editItemLevelInput, setEditItemLevelInput] = useState<string>('');
  const [editItemDescriptionInput, setEditItemDescriptionInput] = useState<string>('');

  // UI State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isItemCreatorVisible, setIsItemCreatorVisible] = useState<boolean>(false);
  const [isBackpackVisible, setIsBackpackVisible] = useState<boolean>(false);
  const [isEditItemModalVisible, setIsEditItemModalVisible] = useState<boolean>(false);
  const [generatedItemPreview, setGeneratedItemPreview] = useState<GeneratedItem | null>(null);
  
  const adventureLogRef = useRef<HTMLDivElement>(null);

  // Load data from localStorage
  useEffect(() => {
    try {
      const savedWorlds = localStorage.getItem('persian_dungeon_worlds');
      if (savedWorlds) setWorlds(JSON.parse(savedWorlds));
      const savedCharacters = localStorage.getItem('persian_dungeon_characters');
      if (savedCharacters) setCharacters(JSON.parse(savedCharacters));
      const savedLogs = localStorage.getItem('persian_dungeon_adventure_logs');
      if (savedLogs) setAdventureLogs(JSON.parse(savedLogs));
    } catch (e) {
      console.error("Error loading data from localStorage:", e);
      setError("خطا در بارگذاری اطلاعات ذخیره شده. ممکن است اطلاعات قبلی از بین رفته باشد.");
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {localStorage.setItem('persian_dungeon_worlds', JSON.stringify(worlds));}, [worlds]);
  useEffect(() => {localStorage.setItem('persian_dungeon_characters', JSON.stringify(characters));}, [characters]);
  useEffect(() => {localStorage.setItem('persian_dungeon_adventure_logs', JSON.stringify(adventureLogs));}, [adventureLogs]);

  // Scroll to bottom of adventure log
   useEffect(() => {
    if (activeView === 'adventure' && adventureLogRef.current) {
      adventureLogRef.current.scrollTo({ top: adventureLogRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [adventureLogs, activeView, currentCharacter, isLoading]);


  const handleNavigate = (view: ViewMode, characterId?: string, worldIdForMap?: string) => {
    setActiveView(view);
    setError(''); 
    setSelectedWorldForManagement(null); 
    setEditingWorld(null);
    setEditingItem(null);
    setIsItemCreatorVisible(false);
    setIsBackpackVisible(false);

    if (view === 'adventure') {
        if (characterId) {
            const char = characters.find(c => c.id === characterId);
            if(char) {
                setCurrentCharacter(char);
                const world = worlds.find(w => w.id === char.worldId);
                setCurrentWorld(world || null);
            } else {
                 setError("شخصیت مورد نظر برای ماجراجویی یافت نشد.");
                 setActiveView('worlds'); 
            }
        } else if (!currentCharacter) {
            setError("ابتدا یک شخصیت بسازید یا انتخاب کنید.");
            setActiveView('home'); 
        }
    } else if (view === 'map_display') {
        let targetWorldId = worldIdForMap;
        if (!targetWorldId) {
            if (currentCharacter?.worldId) targetWorldId = currentCharacter.worldId;
            else if (selectedWorldForManagement?.id) targetWorldId = selectedWorldForManagement.id;
            else if (currentWorld?.id) targetWorldId = currentWorld.id;
        }
        
        if (targetWorldId) {
             const world = worlds.find(w => w.id === targetWorldId);
             if (world) setCurrentWorld(world);
             else {
                setError("جهان مورد نظر برای نمایش نقشه یافت نشد.");
                setCurrentWorld(null);
             }
        } else {
            setError("هیچ جهانی برای نمایش نقشه مشخص نشده است.");
            setCurrentWorld(null);
        }
    }
  };

  const handleCreateWorld = useCallback(async () => {
    if (!userWorldDescInput.trim()) {
      setError('لطفاً توصیفی اولیه از جهان خود ارائه دهید.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const { world_name_fa, world_details_fa, map_concept_fa } = await geminiService.generateWorldDetailsAndMap(userWorldDescInput);
      const newWorld: World = {
        id: Date.now().toString(),
        name: world_name_fa,
        userDescription: userWorldDescInput,
        aiGeneratedDetails: world_details_fa,
        mapConcept: map_concept_fa,
      };
      setWorlds(prev => [...prev, newWorld]);
      setCurrentWorld(newWorld); 
      setUserWorldDescInput(''); 
    } catch (err) {
      console.error("Failed to create world:", err);
      setError(`خطا در خلق جهان: ${err instanceof Error ? err.message : "مشکل نامشخص"}`);
    } finally {
      setIsLoading(false);
    }
  }, [userWorldDescInput]);

  const handleGenerateGuidedRandomWorld = useCallback(async () => {
    if (!guidedWorldGenreInput.trim() || !guidedWorldUserDescInput.trim()) {
      setError('لطفاً ژانر و توصیف اولیه جهان را برای ساخت هدایت‌شده ارائه دهید.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const { world_name_fa, world_details_fa, map_concept_fa } = await geminiService.generateGuidedRandomWorld(
        guidedWorldGenreInput,
        guidedWorldSuggestedNameInput,
        guidedWorldUserDescInput
      );
      const newWorld: World = {
        id: Date.now().toString(),
        name: world_name_fa,
        userDescription: `ژانر: ${guidedWorldGenreInput}. نام پیشنهادی: ${guidedWorldSuggestedNameInput || 'نامشخص'}. توصیف اولیه: ${guidedWorldUserDescInput}`,
        aiGeneratedDetails: world_details_fa,
        mapConcept: map_concept_fa,
      };
      setWorlds(prev => [...prev, newWorld]);
      setCurrentWorld(newWorld);
      setGuidedWorldGenreInput('فانتزی حماسی');
      setGuidedWorldSuggestedNameInput('');
      setGuidedWorldUserDescInput('');
    } catch (err) {
      console.error("Failed to create guided random world:", err);
      setError(`خطا در خلق جهان هدایت‌شده: ${err instanceof Error ? err.message : "مشکل نامشخص"}`);
    } finally {
      setIsLoading(false);
    }
  }, [guidedWorldGenreInput, guidedWorldSuggestedNameInput, guidedWorldUserDescInput]);
  
  const handleUpdateWorld = useCallback(async () => {
    if (!editingWorld || !editWorldNameInput.trim() || !editWorldDescInput.trim()) {
      setError('نام و توصیف جهان برای ویرایش نمی‌تواند خالی باشد.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const { world_details_fa, map_concept_fa } = await geminiService.generateWorldDetailsAndMap(editWorldDescInput);
      const updatedWorld: World = {
        ...editingWorld,
        name: editWorldNameInput,
        userDescription: editWorldDescInput,
        aiGeneratedDetails: world_details_fa,
        mapConcept: map_concept_fa,
      };
      setWorlds(prev => prev.map(w => w.id === updatedWorld.id ? updatedWorld : w));
      if(selectedWorldForManagement?.id === updatedWorld.id) setSelectedWorldForManagement(updatedWorld);
      if(currentWorld?.id === updatedWorld.id) setCurrentWorld(updatedWorld);
      setEditingWorld(null); 
      setEditWorldNameInput('');
      setEditWorldDescInput('');
    } catch (err) {
      console.error("Failed to update world:", err);
      setError(`خطا در به‌روزرسانی جهان: ${err instanceof Error ? err.message : "مشکل نامشخص"}`);
    } finally {
      setIsLoading(false);
    }
  }, [editingWorld, editWorldNameInput, editWorldDescInput, currentWorld?.id, selectedWorldForManagement?.id]);

  const handleDeleteWorld = (worldId: string) => {
    if (window.confirm("آیا از حذف این جهان و تمام شخصیت‌ها و لاگ‌های ماجراجویی مرتبط با آن مطمئن هستید؟ این عمل غیرقابل بازگشت است.")) {
      setWorlds(prev => prev.filter(w => w.id !== worldId));
      const charsInWorld = characters.filter(c => c.worldId === worldId);
      charsInWorld.forEach(char => {
        setAdventureLogs(prevLogs => {
          const newLogs = {...prevLogs};
          delete newLogs[char.id];
          return newLogs;
        });
      });
      setCharacters(prev => prev.filter(c => c.worldId !== worldId));
      if (currentWorld?.id === worldId) setCurrentWorld(null);
      if (selectedWorldForManagement?.id === worldId) setSelectedWorldForManagement(null);
      if (currentCharacter?.worldId === worldId) setCurrentCharacter(null);
    }
  };

  const handleExpandMap = useCallback(async () => {
    const targetWorld = currentWorld || selectedWorldForManagement;
    if (!targetWorld) {
        setError("ابتدا یک جهان را برای نمایش نقشه انتخاب کنید.");
        return;
    }
    setIsLoading(true);
    setError('');
    try {
        const newMapConcept = await geminiService.expandMapConcept(targetWorld.mapConcept, targetWorld.aiGeneratedDetails);
        const updatedWorld = { ...targetWorld, mapConcept: newMapConcept };
        
        setCurrentWorld(updatedWorld); 
        setWorlds(prevWorlds => prevWorlds.map(w => w.id === updatedWorld.id ? updatedWorld : w));
        if (selectedWorldForManagement?.id === updatedWorld.id) {
            setSelectedWorldForManagement(updatedWorld);
        }
    } catch (err) {
        console.error("Failed to expand map:", err);
        setError(`خطا در گسترش نقشه: ${err instanceof Error ? err.message : "مشکل نامشخص"}`);
    } finally {
        setIsLoading(false);
    }
  }, [currentWorld, selectedWorldForManagement]);

  const handleCreateCharacterAndStartAdventure = useCallback(async () => {
    if (!characterNameInput.trim()) {
      setError('لطفاً نام شخصیت خود را وارد کنید.');
      return;
    }
    if (!characterAgeInput.trim() || !characterClassInput.trim() || !characterRaceInput.trim() || !characterUserDescInput.trim()) {
      setError('لطفا تمام فیلدهای سن، کلاس، نژاد و توصیف شخصیت را پر کنید.');
      return;
    }
    const worldToAssign = currentWorld || selectedWorldForManagement; 
    if (!worldToAssign) {
      setError('ابتدا باید جهانی برای شخصیت خود خلق کنید یا انتخاب نمایید.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const { character_details_fa, image_prompt_for_avatar } = await geminiService.generateCharacterDetailsAndImagePrompt(
        characterNameInput,
        characterAgeInput,
        characterClassInput,
        characterRaceInput,
        characterUserDescInput,
        worldToAssign.aiGeneratedDetails
      );

      const imageUrl = await geminiService.generateImage(image_prompt_for_avatar);

      const newCharacter: Character = {
        id: Date.now().toString(),
        name: characterNameInput,
        worldId: worldToAssign.id,
        inventory: [],
        age: characterAgeInput,
        characterClass: characterClassInput,
        race: characterRaceInput,
        userDescription: characterUserDescInput,
        aiGeneratedDetails: character_details_fa,
        imageUrl: imageUrl,
        imagePrompt: image_prompt_for_avatar,
      };

      setCharacters(prev => [...prev, newCharacter]);
      setCurrentCharacter(newCharacter);
      setCurrentWorld(worlds.find(w => w.id === newCharacter.worldId) || worldToAssign); 
      
      setCharacterNameInput('');
      setCharacterAgeInput('');
      setCharacterClassInput('');
      setCharacterRaceInput('');
      setCharacterUserDescInput('');

      setAdventureLogs(prevLogs => ({
        ...prevLogs,
        [newCharacter.id]: [{ id: `${Date.now()}-system-init`, sender: 'system', text: `ماجراجویی برای ${newCharacter.name} در جهان ${worldToAssign.name} آغاز شد.`, timestamp: new Date() }]
      }));
      setActiveView('adventure');
    } catch (err) {
      console.error("Failed to create character:", err);
      setError(`خطا در ساخت شخصیت: ${err instanceof Error ? err.message : "مشکل نامشخص"}`);
    } finally {
      setIsLoading(false);
    }
  }, [
    characterNameInput, characterAgeInput, characterClassInput, characterRaceInput, characterUserDescInput, 
    currentWorld, selectedWorldForManagement, worlds
  ]);

  const handleDeleteCharacter = (characterId: string) => {
    if (window.confirm("آیا از حذف این شخصیت و تمام لاگ ماجراجویی او مطمئن هستید؟")) {
        setCharacters(prev => prev.filter(c => c.id !== characterId));
        setAdventureLogs(prevLogs => {
            const newLogs = {...prevLogs};
            delete newLogs[characterId];
            return newLogs;
        });
        if (currentCharacter?.id === characterId) {
            setCurrentCharacter(null);
            if(activeView === 'adventure') setActiveView('worlds');
        }
    }
  };

  const handleGenerateItem = useCallback(async () => {
    if (!itemNameInput.trim()) {
      setError('لطفاً نام آیتم را وارد کنید.');
      return;
    }
    setIsLoading(true);
    setError('');
    setGeneratedItemPreview(null);
    try {
      const itemData = await geminiService.generateItemData(itemNameInput);
      const imageUrl = await geminiService.generateImage(itemData.image_prompt);
      
      const newItem: GeneratedItem = {
        id: Date.now().toString(),
        ...itemData,
        imageUrl,
      };
      setGeneratedItemPreview(newItem);
    } catch (err) {
      console.error("Failed to generate item:", err);
      setError(`خطا در ساخت آیتم: ${err instanceof Error ? err.message : "مشکل نامشخص"}`);
    } finally {
      setIsLoading(false);
    }
  }, [itemNameInput]);

  const handleAddItemToInventory = useCallback(() => {
    if (generatedItemPreview && currentCharacter) {
      const updatedCharacter = {
        ...currentCharacter,
        inventory: [...currentCharacter.inventory, generatedItemPreview],
      };
      setCurrentCharacter(updatedCharacter);
      setCharacters(prevChars => prevChars.map(c => c.id === updatedCharacter.id ? updatedCharacter : c));
      setGeneratedItemPreview(null);
      setItemNameInput('');
      setIsItemCreatorVisible(false);
    } else {
        setError("ابتدا یک شخصیت برای افزودن آیتم به کوله‌پشتی او انتخاب کنید یا در ماجراجویی باشید.");
    }
  }, [generatedItemPreview, currentCharacter]);

  const handleDeleteItemFromInventory = (itemId: string) => {
    if (!currentCharacter) return;
    if (window.confirm("آیا از حذف این آیتم از کوله‌پشتی مطمئن هستید؟")) {
        const updatedInventory = currentCharacter.inventory.filter(item => item.id !== itemId);
        const updatedCharacter = {...currentCharacter, inventory: updatedInventory };
        setCurrentCharacter(updatedCharacter);
        setCharacters(prevChars => prevChars.map(c => c.id === updatedCharacter.id ? updatedCharacter : c));
    }
  };

  const handleOpenEditItemModal = (item: GeneratedItem) => {
    setEditingItem(item);
    setEditItemNameInput(item.name_fa);
    setEditItemRankInput(item.rank_fa);
    setEditItemLevelInput(item.level.toString());
    setEditItemDescriptionInput(item.description_fa);
    setIsEditItemModalVisible(true);
    // Don't close backpack, just stack modal or close it if mobile
    setIsBackpackVisible(false); 
  };

  const handleSaveItemEdit = () => {
    if (!editingItem || !currentCharacter) {
        setError("خطا: آیتم یا شخصیت معتبری برای ویرایش انتخاب نشده است.");
        return;
    }
    if (!editItemNameInput.trim() || !editItemRankInput.trim() || !editItemDescriptionInput.trim()) {
        setError("تمام فیلدهای متنی آیتم باید پر شوند.");
        return;
    }
    const level = parseInt(editItemLevelInput, 10);
    if (isNaN(level) || level < 0) {
        setError("سطح آیتم باید یک عدد معتبر باشد.");
        return;
    }

    const updatedItem: GeneratedItem = {
        ...editingItem,
        name_fa: editItemNameInput,
        rank_fa: editItemRankInput,
        level: level,
        description_fa: editItemDescriptionInput,
    };

    const updatedInventory = currentCharacter.inventory.map(item =>
        item.id === updatedItem.id ? updatedItem : item
    );
    const updatedCharacter = { ...currentCharacter, inventory: updatedInventory };

    setCurrentCharacter(updatedCharacter);
    setCharacters(prevChars => prevChars.map(c => c.id === updatedCharacter.id ? updatedCharacter : c));
    
    setEditingItem(null);
    setIsEditItemModalVisible(false);
    setIsBackpackVisible(true); // Reopen backpack to show changes
    setError('');
  };
  
  const handleSendAdventureMessage = useCallback(async () => {
    if (!adventureInput.trim() || !currentCharacter || !currentWorld) return;

    const userMessage: AdventureMessage = {
      id: `${Date.now()}-user-${Math.random().toString(36).substr(2, 5)}`,
      sender: 'user',
      text: adventureInput,
      timestamp: new Date(),
    };
    
    const currentLogs = adventureLogs[currentCharacter.id] || [];
    setAdventureLogs(prevLogs => ({
        ...prevLogs,
        [currentCharacter.id]: [...currentLogs, userMessage]
    }));
    const messageToSend = adventureInput; 
    setAdventureInput('');
    setIsLoading(true);

    try {
      const inventoryList = currentCharacter.inventory.map(item => item.name_fa).join(', ') || 'خالی';
      const logForAI = currentLogs.slice(-10).map(m => `${m.sender === 'user' ? currentCharacter.name : m.sender}: ${m.text}`).join('\n');
      
      const dmResponseText = await geminiService.generateAdventureResponse(
        currentWorld.aiGeneratedDetails,
        `${currentCharacter.name} (${currentCharacter.race} ${currentCharacter.characterClass}, ${currentCharacter.age}) - ${currentCharacter.userDescription}`,
        inventoryList,
        logForAI,
        messageToSend
      );
      
      const aiMessage: AdventureMessage = {
        id: `${Date.now()}-ai-${Math.random().toString(36).substr(2, 5)}`,
        sender: 'ai',
        text: dmResponseText,
        timestamp: new Date(),
      };
      setAdventureLogs(prevLogs => ({
        ...prevLogs,
        [currentCharacter.id]: [...(prevLogs[currentCharacter.id] || []), aiMessage]
      }));

    } catch (err) {
      console.error("Adventure AI error:", err);
      const errorMessageText = `خطا در ارتباط با Dungeon Master هوش مصنوعی: ${err instanceof Error ? err.message : "مشکل نامشخص"}`;
      const errorMessage: AdventureMessage = {
        id: `${Date.now()}-error-${Math.random().toString(36).substr(2, 5)}`,
        sender: 'system',
        text: errorMessageText,
        timestamp: new Date(),
      };
       setAdventureLogs(prevLogs => ({
        ...prevLogs,
        [currentCharacter.id]: [...(prevLogs[currentCharacter.id] || []), errorMessage]
      }));
       setError(errorMessageText); 
    } finally {
      setIsLoading(false);
    }
  }, [adventureInput, currentCharacter, currentWorld, adventureLogs]);

  const headerNavItems: NavItem[] = useMemo(() => [
    { id: 'adventure', label: 'ماجراجویی', icon: <AdventureIcon className="w-5 h-5" />, onClick: () => currentCharacter ? handleNavigate('adventure', currentCharacter.id) : setError("ابتدا یک شخصیت بسازید یا انتخاب کنید تا بتوانید ماجراجویی کنید.") },
    { id: 'map_display', label: 'نقشه جهان', icon: <MapIcon className="w-5 h-5" />, onClick: () => (currentWorld || selectedWorldForManagement || (currentCharacter && worlds.find(w => w.id === currentCharacter.worldId)) ) ? handleNavigate('map_display', undefined, (currentWorld || selectedWorldForManagement || (currentCharacter && worlds.find(w => w.id === currentCharacter.worldId)))?.id) : setError("ابتدا جهانی را بسازید یا انتخاب کنید تا نقشه آن را ببینید.") },
    { id: 'worlds', label: 'جهان‌ها', icon: <WorldIcon className="w-5 h-5" />, onClick: () => handleNavigate('worlds') }, 
    { id: 'home', label: 'خانه', icon: <HomeIcon className="w-5 h-5" />, isActive: activeView === 'home', onClick: () => handleNavigate('home') },
  ], [activeView, currentCharacter, currentWorld, selectedWorldForManagement, worlds]);

  const footerNavItems: NavItem[] = useMemo(() => [
    { id: 'f_adventure', label: 'ماجراجویی', icon: <AdventureIcon className="w-7 h-7 mb-1" />, onClick: () => currentCharacter ? handleNavigate('adventure', currentCharacter.id) : setError("ابتدا یک شخصیت بسازید یا انتخاب کنید.") },
    { id: 'f_map', label: 'نقشه جهان', icon: <MapIcon className="w-7 h-7 mb-1" />, onClick: () => (currentWorld || selectedWorldForManagement || (currentCharacter && worlds.find(w => w.id === currentCharacter.worldId))) ? handleNavigate('map_display', undefined, (currentWorld || selectedWorldForManagement || (currentCharacter && worlds.find(w => w.id === currentCharacter.worldId)))?.id) : setError("ابتدا جهانی را بسازید یا انتخاب کنید.") },
    { id: 'f_worlds', label: 'جهان‌ها', icon: <WorldIcon className="w-7 h-7 mb-1" />, onClick: () => handleNavigate('worlds') }, 
    { id: 'f_home', label: 'خانه', icon: <HomeIcon className="w-7 h-7 mb-1" />, onClick: () => handleNavigate('home') },
  ], [currentCharacter, currentWorld, selectedWorldForManagement, worlds]);

  const gameFeatures: FeatureListItem[] = [
    { icon: <SwordsIcon className="w-5 h-5 text-amber-400" />, text: 'مبارزه پویا با هوش مصنوعی' },
    { icon: <WorldIcon className="w-5 h-5 text-amber-400" />, text: 'خلق جهان‌های منحصر به فرد' },
    { icon: <PlayerIcon className="w-5 h-5 text-amber-400" />, text: 'شخصیت‌سازی عمیق با آواتار' },
    { icon: <SparklesIcon className="w-5 h-5 text-amber-400" />, text: 'آیتم‌های جادویی با آیکون اختصاصی' },
  ];
  
  const currentAdventureLog = useMemo(() => {
    return currentCharacter ? (adventureLogs[currentCharacter.id] || []) : [];
  }, [currentCharacter, adventureLogs]);

  // --- Sub-components (Render Functions) ---

  const renderCharacterCreationForm = (worldContext: World) => (
    <div className="glass-card p-4 rounded-xl animate-fadeIn">
      <div className="mb-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
          <h3 className="text-amber-400 font-bold mb-1 text-md flex items-center gap-2"><WorldIcon className="w-5 h-5"/> جهان: {worldContext.name}</h3>
          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed opacity-80">{worldContext.aiGeneratedDetails}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <input type="text" value={characterNameInput} onChange={(e) => setCharacterNameInput(e.target.value)} placeholder="نام شخصیت..." className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm transition-all" />
        <input type="text" value={characterAgeInput} onChange={(e) => setCharacterAgeInput(e.target.value)} placeholder="سن (مثال: ۲۵)" className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm transition-all" />
        <input type="text" value={characterClassInput} onChange={(e) => setCharacterClassInput(e.target.value)} placeholder="کلاس (مثال: جنگجو)" className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm transition-all" />
        <input type="text" value={characterRaceInput} onChange={(e) => setCharacterRaceInput(e.target.value)} placeholder="نژاد (مثال: الف)" className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm transition-all" />
      </div>
      <textarea value={characterUserDescInput} onChange={(e) => setCharacterUserDescInput(e.target.value)} placeholder="توصیف شخصیت (ظاهر، پیش‌زمینه...)" rows={3} className="w-full mb-4 p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm transition-all resize-none"></textarea>
      
      <Button onClick={handleCreateCharacterAndStartAdventure} disabled={isLoading} className="shadow-lg shadow-amber-500/20">
        {isLoading ? 'در حال خلق سرنوشت...' : 'آغاز ماجراجویی'}
      </Button>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-200 font-sans">
      <Header 
        logoText="رویاهای سیاهچال"
        logoSubtitle="Persian Dungeon Dreams"
        logoIcon={<CastleIcon className="w-8 h-8 text-amber-500" />}
        navItems={headerNavItems}
        activeItem={activeView}
        onNavigate={(id) => handleNavigate(id as ViewMode)}
      />

      {isLoading && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-purple-500 to-amber-500 animate-pulse z-[60]"></div>
      )}

      {error && (
         <div className="fixed top-20 left-1/2 transform -translate-x-1/2 p-4 bg-red-900/90 backdrop-blur border border-red-500 rounded-xl shadow-2xl text-white text-sm z-50 flex items-center gap-4 animate-fadeIn max-w-sm w-[90%]">
          <span className="flex-1">{error}</span>
          <button onClick={() => setError('')} className="p-1 hover:bg-white/20 rounded-full transition-colors"><CloseIcon className="w-5 h-5"/></button>
        </div>
      )}
    
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {activeView === 'adventure' && currentCharacter && currentWorld ? (
          <>
            {/* --- ADVENTURE VIEW --- */}
            <div className="flex-1 flex relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
              
              {/* Desktop Toolbox */}
              <aside className="hidden md:flex flex-col w-64 bg-slate-900/95 border-l border-slate-800/50 p-4 space-y-4 z-20">
                <div className="text-center pb-4 border-b border-slate-800">
                    <h3 className="text-amber-500 font-bold text-lg mb-2">{currentCharacter.name}</h3>
                    {currentCharacter.imageUrl && (
                        <div className="relative w-24 h-24 mx-auto mb-2">
                            <img src={currentCharacter.imageUrl} alt={currentCharacter.name} className="w-full h-full rounded-full object-cover border-2 border-amber-600 shadow-lg shadow-amber-900/50"/>
                        </div>
                    )}
                    <div className="text-xs text-slate-400 space-y-1">
                        <span className="block px-2 py-1 bg-slate-800 rounded">{currentCharacter.race} {currentCharacter.characterClass}</span>
                        <span className="block">سطح: ۱ | HP: 100/100</span>
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                    <button onClick={() => { setIsItemCreatorVisible(true); setIsBackpackVisible(false);}} className="w-full p-3 bg-gradient-to-r from-purple-900/50 to-slate-800 hover:from-purple-800/50 border border-purple-500/30 rounded-lg flex items-center justify-center gap-2 transition-all">
                        <SparklesIcon className="w-5 h-5 text-purple-400" /> <span>ساخت آیتم</span>
                    </button>
                    <button onClick={() => { setIsBackpackVisible(true); setIsItemCreatorVisible(false);}} className="w-full p-3 bg-gradient-to-r from-sky-900/50 to-slate-800 hover:from-sky-800/50 border border-sky-500/30 rounded-lg flex items-center justify-center gap-2 transition-all">
                        <BackpackIcon className="w-5 h-5 text-sky-400" /> <span>کوله‌پشتی ({currentCharacter.inventory.length})</span>
                    </button>
                </div>
              </aside>
      
              {/* Main Chat Area */}
              <main className="flex-1 flex flex-col relative min-w-0">
                <div 
                    ref={adventureLogRef} 
                    className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 pb-24 md:pb-28 scroll-smooth"
                >
                    {currentAdventureLog.length === 0 && (
                        <div className="text-center text-slate-500 mt-10 animate-pulse">ماجراجویی آغاز می‌شود...</div>
                    )}
                    {currentAdventureLog.map(msg => (
                      <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
                        <div className={`max-w-[85%] md:max-w-[70%] p-4 rounded-2xl shadow-lg relative ${
                          msg.sender === 'user' ? 'bg-sky-900/80 text-sky-50 rounded-tr-sm border border-sky-700/50' : 
                          msg.sender === 'ai' ? 'bg-slate-800/90 text-slate-200 rounded-tl-sm border border-slate-700/50' : 
                          'bg-amber-900/20 text-amber-200 border border-amber-600/30 w-full text-center text-sm italic'
                        }`}>
                           {msg.sender === 'ai' && <div className="absolute -top-3 -left-2 w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center border border-slate-600"><CastleIcon className="w-3 h-3 text-amber-500"/></div>}
                          <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                          {msg.sender !== 'system' && (
                              <p className={`text-[10px] mt-2 text-right opacity-60`}>
                                {new Date(msg.timestamp).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                              </p>
                          )}
                        </div>
                      </div>
                    ))}
                    {isLoading && currentAdventureLog.length > 0 && (
                        <div className="flex items-center gap-2 text-slate-400 text-sm p-4 animate-pulse">
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            <span>Dungeon Master در حال فکر کردن است...</span>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 via-slate-900 to-transparent pt-10 pb-4 px-4 md:px-6 z-30">
                  <div className="max-w-4xl mx-auto flex items-end gap-3 bg-slate-800 p-2 rounded-2xl border border-slate-700 shadow-2xl ring-1 ring-white/5">
                     <textarea 
                      value={adventureInput} 
                      onChange={(e) => setAdventureInput(e.target.value)}
                      onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey && adventureInput.trim()) {
                              e.preventDefault();
                              handleSendAdventureMessage();
                          }
                      }}
                      placeholder="چه کاری انجام می‌دهید؟" 
                      className="flex-grow p-3 bg-transparent text-slate-200 placeholder-slate-500 outline-none resize-none text-base max-h-32"
                      rows={1}
                    />
                    <button
                      onClick={handleSendAdventureMessage}
                      disabled={isLoading || !adventureInput.trim()}
                      className="p-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl shadow-lg shadow-amber-600/20 disabled:opacity-50 disabled:shadow-none transition-all transform active:scale-95"
                    >
                      <SendIcon className="w-5 h-5 rtl:rotate-180" />
                    </button>
                  </div>
                </div>
              </main>
              
              {/* Mobile Header for Character Stats */}
              <div className="md:hidden fixed top-16 right-0 left-0 bg-slate-900/90 backdrop-blur border-b border-slate-800 p-2 flex justify-between items-center z-20 px-4 shadow-md">
                 <div className="flex items-center gap-2">
                     {currentCharacter.imageUrl && <img src={currentCharacter.imageUrl} className="w-8 h-8 rounded-full border border-amber-500" />}
                     <span className="font-bold text-sm text-slate-200">{currentCharacter.name}</span>
                 </div>
                 <div className="flex gap-2">
                    <button onClick={() => { setIsItemCreatorVisible(true); setIsBackpackVisible(false);}} className="p-2 bg-purple-900/50 rounded-full text-purple-300"><SparklesIcon className="w-4 h-4"/></button>
                    <button onClick={() => { setIsBackpackVisible(true); setIsItemCreatorVisible(false);}} className="p-2 bg-sky-900/50 rounded-full text-sky-300 relative">
                        <BackpackIcon className="w-4 h-4"/>
                        {currentCharacter.inventory.length > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-[8px] flex items-center justify-center text-white">{currentCharacter.inventory.length}</span>}
                    </button>
                 </div>
              </div>
            </div>
      
            {/* Modals */}
            {isItemCreatorVisible && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setIsItemCreatorVisible(false)}>
                  <div className="glass-card w-full max-w-md p-6 rounded-2xl animate-fadeIn" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-amber-400 flex items-center gap-2"><SparklesIcon className="w-6 h-6"/> ساخت آیتم جادویی</h3>
                      <button onClick={() => setIsItemCreatorVisible(false)} className="text-slate-400 hover:text-white"><CloseIcon className="w-6 h-6"/></button>
                    </div>
                    
                    <div className="space-y-4">
                      <input 
                        type="text" 
                        value={itemNameInput} 
                        onChange={(e) => setItemNameInput(e.target.value)} 
                        placeholder="نام آیتم (مثال: شمشیر اژدها)"
                        className="w-full p-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 outline-none" 
                      />
                      <Button onClick={handleGenerateItem} disabled={isLoading || !itemNameInput.trim()}>
                        {isLoading ? 'در حال آهنگری...' : 'ساخت آیتم'}
                      </Button>
                      
                      {generatedItemPreview && (
                        <div className="mt-4 p-4 bg-slate-800 rounded-xl border border-amber-500/30 animate-fadeIn">
                          <div className="flex gap-4">
                              {generatedItemPreview.imageUrl && (
                                <div className="flex-shrink-0">
                                    <img src={generatedItemPreview.imageUrl} alt={generatedItemPreview.name_fa} className="w-20 h-20 rounded-lg border-2 border-amber-500 shadow-lg object-cover" />
                                </div>
                              )}
                              <div>
                                  <h4 className="text-lg font-bold text-amber-300">{generatedItemPreview.name_fa}</h4>
                                  <span className="text-xs px-2 py-0.5 bg-slate-700 rounded text-amber-200/80">{generatedItemPreview.rank_fa}</span>
                              </div>
                          </div>
                          <p className="text-sm text-slate-300 mt-3 leading-relaxed">{generatedItemPreview.description_fa}</p>
                          <Button onClick={handleAddItemToInventory} variant="secondary" className="mt-4 text-sm py-2">افزودن به کوله‌پشتی</Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
            )}

            {isBackpackVisible && currentCharacter && (
               <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setIsBackpackVisible(false)}>
                  <div className="glass-card w-full max-w-2xl p-6 rounded-2xl max-h-[85vh] flex flex-col animate-fadeIn" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-sky-400 flex items-center gap-2"><BackpackIcon className="w-6 h-6"/> کوله‌پشتی {currentCharacter.name}</h3>
                      <button onClick={() => setIsBackpackVisible(false)} className="text-slate-400 hover:text-white"><CloseIcon className="w-6 h-6"/></button>
                    </div>
                    
                    {currentCharacter.inventory.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-10">
                          <BackpackIcon className="w-16 h-16 opacity-20 mb-4"/>
                          <p>کوله‌پشتی خالی است.</p>
                      </div>
                    ) : (
                      <div className="overflow-y-auto pr-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pb-4">
                        {currentCharacter.inventory.map(item => (
                          <div key={item.id} className="group relative bg-slate-800 rounded-xl p-3 border border-slate-700 hover:border-sky-500/50 transition-all hover:bg-slate-750 flex flex-col items-center text-center">
                            <div className="relative w-full aspect-square mb-2 overflow-hidden rounded-lg bg-black">
                                <img src={item.imageUrl} alt={item.name_fa} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-2">
                                    <div className="flex gap-2">
                                        <button onClick={(e) => {e.stopPropagation(); handleOpenEditItemModal(item);}} className="p-1.5 bg-yellow-600 rounded-full hover:bg-yellow-500"><EditIcon className="w-3 h-3 text-white"/></button>
                                        <button onClick={(e) => {e.stopPropagation(); handleDeleteItemFromInventory(item.id);}} className="p-1.5 bg-red-600 rounded-full hover:bg-red-500"><DeleteIcon className="w-3 h-3 text-white"/></button>
                                    </div>
                                </div>
                            </div>
                            <h4 className="font-semibold text-sky-200 text-sm truncate w-full">{item.name_fa}</h4>
                            <span className="text-[10px] text-slate-400">{item.rank_fa}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
            )}
          </>
        ) : (
          /* --- NON-ADVENTURE VIEWS (HOME, WORLDS, MAP) --- */
          <div className="flex-1 overflow-y-auto">
             <main className="container mx-auto p-4 md:p-6 pb-24 md:pb-10 max-w-6xl">
              
              {activeView === 'home' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column: Create World */}
                  <div className="lg:col-span-7 space-y-6">
                     <div className="glass-card p-6 md:p-8 rounded-2xl">
                        <h2 className="text-2xl font-bold text-amber-400 mb-4 flex items-center gap-3"><CastleIcon className="w-8 h-8"/> {currentWorld ? 'آماده ماجراجویی' : 'خلق جهان جدید'}</h2>
                        
                        {!currentWorld ? (
                          <div className="space-y-4 animate-fadeIn">
                            <p className="text-slate-300 text-sm leading-relaxed">
                              به "رویاهای سیاهچال" خوش آمدید. برای شروع، تصویری از جهان رویایی خود را بنویسید یا از هوش مصنوعی بخواهید برایتان بسازد.
                            </p>
                            <div className="relative">
                                <textarea 
                                  value={userWorldDescInput} 
                                  onChange={(e) => setUserWorldDescInput(e.target.value)} 
                                  placeholder="مثال: سرزمینی که خورشید هرگز در آن غروب نمی‌کند و موجودات شیشه‌ای بر آن حکومت می‌کنند..." 
                                  rows={4} 
                                  className="w-full p-4 bg-slate-800 border border-slate-600 rounded-xl text-slate-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all resize-none shadow-inner"
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button onClick={handleCreateWorld} disabled={isLoading}>
                                  {isLoading ? 'در حال معماری جهان...' : 'خلق جهان'}
                                </Button>
                                <Button onClick={() => handleNavigate('worlds')} variant="secondary">
                                  جهان‌های ذخیره شده
                                </Button>
                            </div>
                          </div>
                        ) : renderCharacterCreationForm(currentWorld)}
                     </div>
                     
                     {/* Guided Creation */}
                     {!currentWorld && (
                         <div className="glass-card p-6 rounded-2xl border-purple-500/20">
                             <div className="flex items-center gap-3 mb-4">
                                 <div className="p-2 bg-purple-900/40 rounded-lg"><SparklesIcon className="w-6 h-6 text-purple-400"/></div>
                                 <h3 className="text-xl font-bold text-purple-300">نمی‌دانید از کجا شروع کنید؟</h3>
                             </div>
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                                <input type="text" value={guidedWorldGenreInput} onChange={(e) => setGuidedWorldGenreInput(e.target.value)} placeholder="ژانر" className="p-3 bg-slate-800 border border-slate-700 rounded-lg text-sm outline-none focus:border-purple-500"/>
                                <input type="text" value={guidedWorldSuggestedNameInput} onChange={(e) => setGuidedWorldSuggestedNameInput(e.target.value)} placeholder="نام پیشنهادی (اختیاری)" className="p-3 bg-slate-800 border border-slate-700 rounded-lg text-sm outline-none focus:border-purple-500"/>
                             </div>
                             <textarea value={guidedWorldUserDescInput} onChange={(e) => setGuidedWorldUserDescInput(e.target.value)} placeholder="یک ایده کوتاه..." rows={1} className="w-full mb-3 p-3 bg-slate-800 border border-slate-700 rounded-lg text-sm outline-none focus:border-purple-500 resize-none"></textarea>
                             <Button onClick={handleGenerateGuidedRandomWorld} disabled={isLoading} className="bg-purple-600 hover:bg-purple-700 text-white">
                                 خلق جهان تصادفی
                             </Button>
                         </div>
                     )}
                  </div>

                  {/* Right Column: Features & Info */}
                  <div className="lg:col-span-5 space-y-6">
                    <FeatureCard title="ویژگی‌های بازی" icon={<SwordsIcon className="w-6 h-6 text-amber-500" />} className="h-full">
                         <div className="space-y-4">
                            {gameFeatures.map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors">
                                    <div className="p-2 bg-slate-900 rounded-full border border-slate-700 shadow">{feature.icon}</div>
                                    <span className="text-sm text-slate-300 font-medium">{feature.text}</span>
                                </div>
                            ))}
                         </div>
                         <div className="mt-8 pt-6 border-t border-slate-700 text-center">
                             <p className="text-xs text-slate-500">قدرت گرفته از Gemini 2.5 & Imagen 3</p>
                         </div>
                    </FeatureCard>
                  </div>
                </div>
              )}
              
              {activeView === 'worlds' && (
                <div className="animate-fadeIn max-w-5xl mx-auto">
                  <div className="flex items-center justify-between mb-8">
                     <h2 className="text-3xl font-bold text-amber-400">مدیریت جهان‌ها</h2>
                     <Button onClick={() => setActiveView('home')} className="w-auto px-6 py-2 text-sm">جهان جدید</Button>
                  </div>
                  
                  {editingWorld ? (
                    <div className="glass-card p-6 rounded-2xl animate-fadeIn">
                       <h3 className="text-xl font-bold text-amber-400 mb-6 flex items-center gap-2"><EditIcon className="w-6 h-6"/> ویرایش {editingWorld.name}</h3>
                       <div className="space-y-4">
                           <input 
                              value={editWorldNameInput} 
                              onChange={(e) => setEditWorldNameInput(e.target.value)} 
                              placeholder="نام جهان"
                              className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg"
                           />
                           <textarea 
                             value={editWorldDescInput} 
                             onChange={(e) => setEditWorldDescInput(e.target.value)} 
                             rows={5} 
                             className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg"
                           />
                           <div className="flex gap-4 pt-2">
                             <Button onClick={handleUpdateWorld} disabled={isLoading}>ذخیره و بازسازی</Button>
                             <Button onClick={() => setEditingWorld(null)} variant="secondary">انصراف</Button>
                           </div>
                       </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {worlds.length === 0 && <p className="text-slate-400 col-span-2 text-center py-10">هیچ جهانی یافت نشد.</p>}
                      {worlds.map(world => (
                        <div key={world.id} className={`group glass-card rounded-xl overflow-hidden transition-all duration-300 hover:shadow-amber-900/20 hover:-translate-y-1 ${selectedWorldForManagement?.id === world.id ? 'ring-2 ring-amber-500' : ''}`}>
                          <div className="p-5">
                              <div className="flex justify-between items-start mb-3">
                                  <h3 className="text-xl font-bold text-amber-100 group-hover:text-amber-400 transition-colors cursor-pointer" onClick={() => setSelectedWorldForManagement(prev => prev?.id === world.id ? null : world)}>
                                      {world.name}
                                  </h3>
                                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button onClick={() => { setEditingWorld(world); setEditWorldNameInput(world.name); setEditWorldDescInput(world.userDescription); setSelectedWorldForManagement(null); }} className="p-2 bg-slate-700 hover:bg-amber-600 rounded-lg text-slate-300 hover:text-white"><EditIcon className="w-4 h-4"/></button>
                                      <button onClick={() => handleDeleteWorld(world.id)} className="p-2 bg-slate-700 hover:bg-red-600 rounded-lg text-slate-300 hover:text-white"><DeleteIcon className="w-4 h-4"/></button>
                                  </div>
                              </div>
                              <p className="text-sm text-slate-400 line-clamp-3 mb-4">{world.userDescription}</p>
                              
                              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700/50">
                                 <span className="text-xs text-slate-500">{characters.filter(c => c.worldId === world.id).length} شخصیت</span>
                                 <button 
                                    className="text-xs flex items-center gap-1 text-sky-400 hover:text-sky-300"
                                    onClick={() => setSelectedWorldForManagement(prev => prev?.id === world.id ? null : world)}
                                 >
                                     جزئیات <ChevronDownIcon className={`w-3 h-3 transition-transform ${selectedWorldForManagement?.id === world.id ? 'rotate-180' : ''}`}/>
                                 </button>
                              </div>
                          </div>
                          
                          {/* Expanded Details */}
                          {selectedWorldForManagement?.id === world.id && (
                              <div className="bg-slate-800/80 p-5 border-t border-slate-700 animate-fadeIn">
                                   <div className="mb-4">
                                       <h4 className="text-sm font-bold text-sky-400 mb-2">شخصیت‌ها:</h4>
                                       {characters.filter(c => c.worldId === world.id).length === 0 ? (
                                          <p className="text-xs text-slate-500 italic">خالی</p>
                                       ) : (
                                          <div className="space-y-2">
                                              {characters.filter(c => c.worldId === world.id).map(char => (
                                                  <div key={char.id} className="flex items-center justify-between bg-slate-700/50 p-2 rounded-lg">
                                                      <div className="flex items-center gap-2">
                                                          {char.imageUrl && <img src={char.imageUrl} className="w-8 h-8 rounded-full border border-slate-500 object-cover"/>}
                                                          <div className="flex flex-col">
                                                              <span className="text-xs font-bold text-slate-200">{char.name}</span>
                                                              <span className="text-[10px] text-slate-400">{char.characterClass}</span>
                                                          </div>
                                                      </div>
                                                      <div className="flex gap-2">
                                                          <button onClick={() => handleNavigate('adventure', char.id)} className="px-3 py-1 bg-green-700/80 hover:bg-green-600 rounded text-[10px] text-white transition-colors">بازی</button>
                                                          <button onClick={() => handleDeleteCharacter(char.id)} className="p-1.5 bg-red-900/50 hover:bg-red-700 rounded text-red-300 transition-colors"><DeleteIcon className="w-3 h-3"/></button>
                                                      </div>
                                                  </div>
                                              ))}
                                          </div>
                                       )}
                                   </div>
                                   <Button onClick={() => { setCurrentWorld(world); setActiveView('home'); }} variant="secondary" className="text-xs py-2">
                                      ساخت شخصیت جدید در اینجا
                                  </Button>
                              </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeView === 'map_display' && (
                  <div className="animate-fadeIn max-w-4xl mx-auto">
                       <h2 className="text-3xl font-bold text-amber-400 mb-6 text-center">
                          <MapIcon className="inline w-8 h-8 ml-2"/>
                          نقشه جهان: {currentWorld ? currentWorld.name : "..."}
                      </h2>
                      {currentWorld ? (
                          <div className="glass-card p-8 rounded-2xl relative overflow-hidden">
                              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                                  <MapIcon className="w-64 h-64 text-amber-500"/>
                              </div>
                              <div className="relative z-10 font-serif leading-loose text-amber-100/90 text-lg whitespace-pre-wrap">
                                  {currentWorld.mapConcept}
                              </div>
                              <div className="mt-8 flex justify-center">
                                <Button onClick={handleExpandMap} disabled={isLoading} className="max-w-xs">
                                    {isLoading ? "در حال اکتشاف..." : "گسترش نقشه"}
                                </Button>
                              </div>
                          </div>
                      ) : (
                          <div className="text-center py-20 bg-slate-800/50 rounded-2xl border border-dashed border-slate-600">
                             <MapIcon className="w-16 h-16 text-slate-600 mx-auto mb-4"/>
                             <p className="text-slate-400">جهانی انتخاب نشده است.</p>
                          </div>
                      )}
                  </div>
              )}
             </main>
          </div>
        )}
      </div>

      {/* Global Edit Item Modal (Active in all views if needed) */}
      {isEditItemModalVisible && editingItem && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[70] flex items-center justify-center p-4" onClick={() => setIsEditItemModalVisible(false)}>
                <div className="glass-card w-full max-w-lg p-6 rounded-2xl animate-fadeIn" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-yellow-400 flex items-center gap-2"><EditIcon className="w-5 h-5"/> ویرایش {editingItem.name_fa}</h3>
                        <button onClick={() => { setIsEditItemModalVisible(false); setEditingItem(null); }} className="text-slate-400 hover:text-white"><CloseIcon className="w-6 h-6"/></button>
                    </div>
                    <div className="space-y-4">
                        <input type="text" value={editItemNameInput} onChange={e => setEditItemNameInput(e.target.value)} placeholder="نام آیتم" className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-white"/>
                        <div className="grid grid-cols-2 gap-3">
                             <input type="text" value={editItemRankInput} onChange={e => setEditItemRankInput(e.target.value)} placeholder="رتبه" className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-white"/>
                             <input type="number" value={editItemLevelInput} onChange={e => setEditItemLevelInput(e.target.value)} placeholder="سطح" className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-white"/>
                        </div>
                        <textarea value={editItemDescriptionInput} onChange={e => setEditItemDescriptionInput(e.target.value)} placeholder="توضیحات" rows={4} className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-white resize-none"></textarea>
                        <Button onClick={handleSaveItemEdit} className="mt-2">ذخیره تغییرات</Button>
                    </div>
                </div>
            </div>
        )}
        
      {/* Mobile Bottom Navigation (Only visible on mobile and outside adventure view usually, but FooterNav handles logic) */}
      {activeView !== 'adventure' && <FooterNav items={footerNavItems} />}
    </div>
  );
};

export { AppInstance as App };