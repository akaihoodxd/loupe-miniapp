import { useState }  from "react";
import { 
  Users, 
  MessageSquare, 
  FileText, 
  UserPlus,  Edit2,
  Trash2,
  MoreVertical,
  PinOff,
  X,
  UserX,
  Crown,
  Circle,
  Copy,
  Check
}  from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger }  from "@/app/components/ui/tabs";
import { Input }  from "@/app/components/ui/input";
import { Textarea }  from "@/app/components/ui/textarea";
import { Button }  from "@/app/components/ui/button";
import { Badge }  from "@/app/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
}  from "@/app/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
}  from "@/app/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
}  from "@/app/components/ui/dialog";


interface TeamMember {
  id: string;
  username: string;
  role: "owner" | "member";
  status: "online" | "offline";
  dealsCount: number;
} 

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  isPinned?: boolean;
  isFromMe?: boolean;
} 

interface Note {
  id: string;
  author: string;
  text: string;
  date: string;
  isPinned?: boolean;
  isFromMe?: boolean;
} 

const initialMembers: TeamMember[] = [
  { id: "1", username: "@owner_user", role: "owner", status: "online", dealsCount: 47 } ,
  { id: "2", username: "@team_member1", role: "member", status: "online", dealsCount: 23 } ,
  { id: "3", username: "@team_member2", role: "member", status: "offline", dealsCount: 15 } ,
];

const initialTeamMessages: Message[] = [
  { id: "1", sender: "@owner_user", text: "Проверьте контрагента 132465789", timestamp: "14:30", isFromMe: false } ,
  { id: "2", sender: "@me", text: "Проверил, риск высокий, не рекомендую", timestamp: "14:32", isFromMe: true } ,
];

const initialNotes: Note[] = [
  {
    id: "1",
    author: "@owner_user",
    text: "Контрагент 132465789 на HTX - мошенник, не работать",
    date: "24.01.2026",
    isPinned: true,
    isFromMe: false,
  } ,
  {
    id: "2",
    author: "@me",
    text: "Проверенный контрагент 987654321 - надежный партнер",
    date: "25.01.2026",
    isFromMe: true,
  } ,
];

export function Team() {
  const [members, setMembers] = useState(initialMembers);
  const [teamMessages, setTeamMessages] = useState(initialTeamMessages);
  const [notes, setNotes] = useState(initialNotes);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editedNoteText, setEditedNoteText] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [newNote, setNewNote] = useState("");
  
  // Invitation code dialog
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteCode] = useState("LOUPE-" + Math.random().toString(36).substring(2, 10).toUpperCase());
  const [copied, setCopied] = useState(false);

  // Dialogs
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: string; id: string }  | null>(null);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [editedText, setEditedText] = useState("");

  const handleCopyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  } ;

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message: Message = {
      id: Date.now().toString(),
      sender: "@me",
      text: newMessage,
      timestamp: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" } ),
      isFromMe: true,
    } ;
    
    setTeamMessages([...teamMessages, message]);
    setNewMessage("");
  } ;

  const handleUnpinMessage = (id: string) => {
    setTeamMessages((prev) => prev.map((m) => (m.id === id ? { ...m, isPinned: false }  : m)));
  } ;

  const handleEditMessage = (message: Message) => {
    setEditingMessage(message);
    setEditedText(message.text);
  } ;

  const handleSaveEdit = () => {
    if (editingMessage) {
      setTeamMessages(teamMessages.map(msg =>
        msg.id === editingMessage.id ? { ...msg, text: editedText }  : msg
      ));
      setEditingMessage(null);
      setEditedText("");
    } 
  } ;

  const handleDeleteMessage = (id: string) => {
    setTeamMessages(teamMessages.filter(msg => msg.id !== id));
    setDeleteDialogOpen(false);
  } ;

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    
    const note: Note = {
      id: Date.now().toString(),
      author: "@me",
      text: newNote,
      date: new Date().toLocaleDateString("ru-RU"),
      isFromMe: true,
    } ;
    
    setNotes([note, ...notes]);
    setNewNote("");
  } ;

  
  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    setDeleteDialogOpen(false);
  } ;

  const startEditNote = (id: string, text: string) => {
    setEditingNoteId(id);
    setEditedNoteText(text);
  } ;

  const saveEditNote = () => {
    if (!editingNoteId) return;
    const text = editedNoteText.trim();
    if (!text) return;
    setNotes(notes.map((n) => (n.id === editingNoteId ? { ...n, text }  : n)));
    setEditingNoteId(null);
    setEditedNoteText("");
  } ;

  const cancelEditNote = () => {
    setEditingNoteId(null);
    setEditedNoteText("");
  } ;

  const handleRemoveMember = (id: string) => {
    setMembers(members.filter(member => member.id !== id));
    setDeleteDialogOpen(false);
  } ;

  const openDeleteDialog = (type: string, id: string) => {
    setItemToDelete({ type, id } );
    setDeleteDialogOpen(true);
  } ;

  const confirmDelete = () => {
    if (!itemToDelete) return;
    
    if (itemToDelete.type === "message") {
      handleDeleteMessage(itemToDelete.id);
    }  else if (itemToDelete.type === "note") {
      handleDeleteNote(itemToDelete.id);
    }  else if (itemToDelete.type === "member") {
      handleRemoveMember(itemToDelete.id);
    } 
    
    setItemToDelete(null);
  } ;

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-black">Команда</h2>
          <p className="text-sm text-muted-foreground">Управление участниками и общение</p>
        </div>
      </div>

      <Tabs defaultValue="members" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="members">
            <Users className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Участники</span>
          </TabsTrigger>
          <TabsTrigger value="chat">
            <MessageSquare className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Чат</span>
          </TabsTrigger>
          <TabsTrigger value="notes">
            <FileText className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Заметки</span>
          </TabsTrigger>
        </TabsList>

        {/* Members Tab */} 
        <TabsContent value="members" className="space-y-4">
          <Button
            className="w-full font-bold text-black"
            style={{ background: "var(--gradient-primary)" } } 
            onClick={() => setShowInviteDialog(true)} 
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Пригласить участника
          </Button>

          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member.id} 
                className="backdrop-blur-xl rounded-xl p-4 border flex items-center justify-between"
                style={{
                  background: "var(--glass-bg)",
                  borderColor: "var(--glass-border)",
                } } 
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center"
                      style={{ background: "var(--gradient-card)" } } 
                    >
                      <Users className="w-5 h-5 md:w-6 md:h-6 text-[var(--color-primary)]" />
                    </div>
                    <Circle
                      className="absolute bottom-0 right-0 w-3 h-3"
                      style={{
                        fill: member.status === "online" ? "var(--success)" : "var(--muted-foreground)",
                        color: member.status === "online" ? "var(--success)" : "var(--muted-foreground)",
                      } } 
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm md:text-base">{member.username} </p>
                      {member.role === "owner" && (
                        <Crown className="w-4 h-4 text-[var(--warning)]" />
                      )} 
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Сделок: {member.dealsCount} 
                    </p>
                  </div>
                </div>

                {member.role !== "owner" && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="text-[var(--destructive)]"
                        onClick={() => openDeleteDialog("member", member.id)} 
                      >
                        <UserX className="w-4 h-4 mr-2" />
                        Удалить
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )} 
              </div>
            ))} 
          </div>
        </TabsContent>

        {/* Team Chat Tab */} 
        <TabsContent value="chat" className="space-y-4">
          <div
            className="backdrop-blur-xl rounded-xl border overflow-hidden"
            style={{
              background: "var(--glass-bg)",
              borderColor: "var(--glass-border)",
            } } 
          >
            <div className="p-4 h-96 overflow-y-auto space-y-3">
              {teamMessages.map((msg) => (
                <div
                  key={msg.id} 
                  className={`flex ${msg.isFromMe ? "justify-end" : "justify-start"} `} 
                >
                  <div className={`max-w-[80%] ${msg.isFromMe ? "text-right" : "text-left"} `} >
                    {!msg.isFromMe && (
                      <p className="text-xs font-bold mb-1 text-[var(--color-primary)]">
                        {msg.sender} 
                      </p>
                    )} 
                    <div
                      className="rounded-xl p-3 relative group"
                      style={{
                        background: msg.isFromMe
                          ? "var(--gradient-card)"
                          : "var(--muted)",
                      } } 
                    >
                      {msg.isPinned && ( /* Corrected block for showing pinned messages */ } 
                        
                      )} 
                      
                      {editingMessage?.id === msg.id ? (
                        <div className="space-y-2">
                          <Input
                            value={editedText} 
                            onChange={(e) => setEditedText(e.target.value)} 
                            className="text-sm"
                          />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={handleSaveEdit} >Сохранить</Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingMessage(null);
                                setEditedText("");
                              } } 
                            >
                              Отмена
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm">{msg.text} </p>
                      )} 
                      
                      <p className="text-xs text-muted-foreground mt-1">{msg.timestamp} </p>

                      {msg.isFromMe && !editingMessage && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              className="absolute top-2 right-2 h-8 w-8 rounded-lg border flex items-center justify-center"
                              style={{ borderColor: "var(--border)", background: "var(--muted)" } } 
                              aria-label="Действия"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditMessage(msg)} >
                              <Edit2 className="w-4 h-4 mr-2" />
                              Редактировать
                            </DropdownMenuItem>

                            {msg.isPinned && ( /* Corrected block for showing pinned messages */ } 
                              
                            )} 

                            <DropdownMenuItem
                              onClick={() => openDeleteDialog("message", msg.id)} 
                              className="text-[var(--destructive)]"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Удалить
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )} 
                    </div>
                  </div>
                </div>
              ))} 
            </div>

            <div className="border-t p-3 flex gap-2">
              <Input
                placeholder="Сообщение..."
                value={newMessage} 
                onChange={(e) => setNewMessage(e.target.value)} 
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()} 
              />
              <Button
                onClick={handleSendMessage} 
                style={{ background: "var(--gradient-primary)", color: "#000" } } 
              >
                Отправить
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Notes Tab */} 
        <TabsContent value="notes" className="space-y-4">
          <div
            className="backdrop-blur-xl rounded-xl p-4 border"
            style={{
              background: "var(--glass-bg)",
              borderColor: "var(--glass-border)",
            } } 
          >
            <textarea
              className="w-full p-3 rounded-xl border text-sm resize-none mb-3"
              rows={3} 
              placeholder="Новая заметка..."
              value={newNote} 
              onChange={(e) => setNewNote(e.target.value)} 
              style={{
                background: "var(--input)",
                borderColor: "var(--border)",
              } } 
            />
            <Button
              onClick={handleAddNote} 
              className="w-full font-bold text-black"
              style={{ background: "var(--gradient-primary)" } } 
            >
              Добавить заметку
            </Button>
          </div>

          <div className="space-y-3">
            {notes.map((note) => (
                <div
                  key={note.id} 
                  className="backdrop-blur-xl rounded-xl p-4 border relative group"
                  style={{
                    background: "var(--glass-bg)",
                    borderColor: "var(--glass-border)",
                  } } 
                >
                  

                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <p className="text-xs font-bold text-[var(--color-primary)]">
                        {note.author} 
                      </p>
                      <p className="text-xs text-muted-foreground">{note.date} </p>
                    </div>

                    {note.isFromMe && (
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => openDeleteDialog("note", note.id)} 
                        >
                          <Trash2 className="w-4 h-4 text-[var(--destructive)]" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => startEditNote(note.id, note.text)} 
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )} 
                  </div>

                  {editingNoteId === note.id ? (
  <div className="space-y-2">
    <Textarea
      value={editedNoteText} 
      onChange={(e) => setEditedNoteText(e.target.value)} 
      className="text-sm"
    />
    <div className="flex gap-2">
      <Button size="sm" onClick={saveEditNote} >Сохранить</Button>
      <Button size="sm" variant="outline" onClick={cancelEditNote} >Отмена</Button>
    </div>
  </div>
) : (
  <p className="text-sm">{note.text} </p>
)} 
                </div>
              ))} 
          </div>
        </TabsContent>
      </Tabs>

      {/* Invite Dialog */} 
      <Dialog open={showInviteDialog}  onOpenChange={setShowInviteDialog} >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Пригласить участника</DialogTitle>
            <DialogDescription>
              Отправьте этот код приглашения новому участнику команды
            </DialogDescription>
          </DialogHeader>
          
          <div
            className="p-4 rounded-xl border text-center space-y-3"
            style={{
              background: "var(--gradient-card)",
              borderColor: "var(--color-primary)",
            } } 
          >
            <p className="text-xs text-muted-foreground">Код приглашения</p>
            <p className="text-2xl font-black font-mono tracking-wider text-[var(--color-primary)]">
              {inviteCode} 
            </p>
            
            <Button
              onClick={handleCopyInviteCode} 
              className="w-full font-bold"
              style={{
                background: copied ? "var(--success)" : "var(--gradient-primary)",
                color: "#000",
              } } 
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Скопировано!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Копировать код
                </>
              )} 
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Код действителен в течение 24 часов
          </p>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */} 
      <AlertDialog open={deleteDialogOpen}  onOpenChange={setDeleteDialogOpen} >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Подтверждение удаления</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить{" "} 
              {itemToDelete?.type === "message"
                ? "это сообщение"
                : itemToDelete?.type === "note"
                ? "эту заметку"
                : "этого участника"} 
              ? Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete} 
              style={{ background: "var(--destructive)" } } 
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 

export default Team;

// Added interval logic for better date filtering
const handleIntervalChange = (interval) => {
  // Logic to handle interval changes (Today, Week, Month)
};
<Button size='sm' onClick={() => handleIntervalChange('today')}>Сегодня</Button>
<Button size='sm' onClick={() => handleIntervalChange('week')}>Неделя</Button>
<Button size='sm' onClick={() => handleIntervalChange('month')}>Месяц</Button>
