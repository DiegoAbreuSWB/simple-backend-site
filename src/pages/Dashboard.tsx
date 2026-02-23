import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTasks, TaskStatus } from "@/hooks/useTasks";
import { Navigate } from "react-router-dom";
import { TaskCard } from "@/components/TaskCard";
import { TaskForm } from "@/components/TaskForm";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckSquare, LogOut, Loader2 } from "lucide-react";

export default function Dashboard() {
  const { user, loading, signOut } = useAuth();
  const { tasks, isLoading } = useTasks();
  const [filter, setFilter] = useState<"all" | TaskStatus>("all");

  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;

  const filtered = filter === "all" ? tasks : tasks.filter((t) => t.status === filter);
  const counts = {
    all: tasks.length,
    pending: tasks.filter((t) => t.status === "pending").length,
    in_progress: tasks.filter((t) => t.status === "in_progress").length,
    done: tasks.filter((t) => t.status === "done").length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
              <CheckSquare className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="font-display text-xl font-bold">TaskFlow</h1>
          </div>
          <div className="flex items-center gap-2">
            <TaskForm />
            <Button variant="ghost" size="icon" onClick={signOut} title="Sair">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-3xl px-4 py-6">
        {/* Stats */}
        <div className="mb-6 grid grid-cols-4 gap-3">
          {([
            { key: "all", label: "Total" },
            { key: "pending", label: "Pendentes" },
            { key: "in_progress", label: "Em progresso" },
            { key: "done", label: "Concluídas" },
          ] as const).map(({ key, label }) => (
            <div key={key} className="rounded-xl border border-border bg-card p-3 text-center animate-fade-in">
              <p className="font-display text-2xl font-bold">{counts[key]}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs + List */}
        <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="all" className="flex-1">Todas</TabsTrigger>
            <TabsTrigger value="pending" className="flex-1">Pendentes</TabsTrigger>
            <TabsTrigger value="in_progress" className="flex-1">Em progresso</TabsTrigger>
            <TabsTrigger value="done" className="flex-1">Concluídas</TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="mt-0">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-12 text-center animate-fade-in">
                <p className="text-muted-foreground">Nenhuma tarefa encontrada</p>
                <p className="mt-1 text-sm text-muted-foreground">Clique em "Nova tarefa" para começar</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
