import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useFinance } from "@/contexts/FinanceContext";
import { Category, CategoryType } from "@/types/finance";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoryBadge } from "@/components/ui/category-badge";
import { CategoryForm } from "./CategoryForm";
import { Loader2, PencilIcon, TrashIcon, PlusCircle, MinusCircle, Plus, TrendingUp } from "lucide-react";
import { StandardModal } from "@/components/ui/standard-modal";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { TabButton } from "@/components/ui/tab-button";

export default function CategoriesManager() {
  const { categories, isLoading, addCategory, updateCategory, deleteCategory } = useFinance();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedType, setSelectedType] = useState<CategoryType>("expense");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("expense");
  const tabs = [
    { id: "expense", label: "Despesas", icon: <MinusCircle className="h-4 w-4" /> },
    { id: "income", label: "Receitas", icon: <Plus className="h-4 w-4" /> },
    { id: "investment", label: "Investimentos", icon: <TrendingUp className="h-4 w-4" /> }
  ];

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setSelectedType(category.type);
    setIsDialogOpen(true);
  };

  const handleDelete = async (categoryId: string) => {
    try {
      await deleteCategory(categoryId);
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleSubmit = async (data: Category) => {
    try {
      if (selectedCategory) {
        await updateCategory({
          ...selectedCategory,
          ...data
        });
      } else {
        await addCategory({
          ...data,
          type: selectedType,
          id: '', // Will be generated by the backend
        });
      }
      setIsDialogOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleAddNew = (type: CategoryType) => {
    setSelectedType(type);
    setSelectedCategory(null);
    setIsDialogOpen(true);
  };

  const filteredCategories = (type: CategoryType) => 
    categories.filter((category) => category.type === type);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 w-full md:w-[400px]">
        {tabs.map(tab => (
          <TabButton
            key={tab.id}
            value={tab.id}
            icon={tab.icon}
            label={tab.label}
            isActive={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          />
        ))}
      </div>
      {tabs.map(tab => (
        activeTab === tab.id && (
          <div key={tab.id} className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">
                {tab.id === "expense"
                  ? "Categorias de Despesas"
                  : tab.id === "income"
                    ? "Categorias de Receitas"
                    : "Categorias de Investimentos"}
              </h3>
              <Button
                size="sm"
                onClick={() => handleAddNew(tab.id as CategoryType)}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Nova Categoria
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCategories(tab.id as CategoryType).map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <CategoryBadge category={category} />
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(category)}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir Categoria</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(category.id)}>
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      ))}

      <StandardModal
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setSelectedCategory(null);
        }}
        title={selectedCategory ? "Editar Categoria" : "Nova Categoria"}
        description={
          selectedCategory
            ? "Edite os detalhes da categoria abaixo"
            : "Preencha os detalhes da nova categoria abaixo"
        }
      >
        <CategoryForm
          category={selectedCategory}
          type={selectedType}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsDialogOpen(false);
            setSelectedCategory(null);
          }}
        />
      </StandardModal>
    </div>
  );
}
