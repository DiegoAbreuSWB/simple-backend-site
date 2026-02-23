import { Task, TaskStatus, useTasks } from "@/hooks/useTasks";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowRight, Calendar } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const statusLabels: Record<TaskStatus, string> = {
  pending: "Pendente",
  in_progress: "Em progresso",
  done: "Concluída",
};

const statusColors: Record<TaskStatus, string> = {
  pending: "bg-muted text-muted-foreground",
  in_progress: "bg-primary/15 text-primary border-primary/30",
  done: "bg-success/15 text-success border-success/30",
};

const priorityLabels: Record<string, string> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
};

const priorityColors: Record<string, string> = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-primary/15 text-primary",
  high: "bg-destructive/15 text-destructive",
};

const nextStatus: Record<TaskStatus, TaskStatus | null> = {
  pending: "in_progress",
  in_progress: "done",
  done: null,
};

export function TaskCard({ task }: { task: Task }) {
  const { updateTask, deleteTask } = useTasks();

  const handleAdvance = () => {
    const next = nextStatus[task.status];
    if (!next) return;
    updateTask.mutate(
      { id: task.id, status: next },
      { onSuccess: () => toast.success(`Tarefa movida para "${statusLabels[next]}"`) }
    );
  };

  const handleDelete = () => {
    deleteTask.mutate(task.id, {
      onSuccess: () => toast.success("Tarefa removida"),
    });
  };

  return (
    <Card className="group animate-fade-in transition-all hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className={`font-display font-semibold leading-tight ${task.status === "done" ? "line-through text-muted-foreground" : ""}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{task.description}</p>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge variant="outline" className={statusColors[task.status]}>
                {statusLabels[task.status]}
              </Badge>
              <Badge variant="outline" className={priorityColors[task.priority]}>
                {priorityLabels[task.priority]}
              </Badge>
              {task.due_date && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(task.due_date), "dd MMM", { locale: ptBR })}
                </span>
              )}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            {nextStatus[task.status] && (
              <Button variant="ghost" size="icon" onClick={handleAdvance} title="Avançar status">
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={handleDelete} title="Remover">
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
