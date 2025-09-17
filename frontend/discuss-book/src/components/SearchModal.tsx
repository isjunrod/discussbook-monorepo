// SearchModal.tsx
"use client";

import { useState, useEffect, useContext } from "react";
import { Search, Globe, FileText, User, Lock } from "lucide-react";
import {
    Dialog,
    DialogContent,
} from "@/src/components/dialog";
import { Input } from "@/src/components/input";
import { Button } from "@/src/components/button";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { ThemeContext } from "../state/context";
import { useRouter } from "next/navigation";

export function SearchModal({ open, setOpen }: { open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>> }) {

    const { state, dispatch } = useContext(ThemeContext);
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState<any>([]);
    const router = useRouter();

    // Efecto para filtrar resultados basados en el término de búsqueda
    useEffect(() => {
        // Si implementas la búsqueda real, aquí harías la llamada a tu API
        if (searchTerm.trim() === "") {
            setResults(state.spacesDiscussions);
        } else {
            const filteredResults = state.spacesDiscussions.filter((item: any) =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setResults(filteredResults);
        }
    }, [searchTerm]);

    useEffect(() => {
        setResults(state.spacesDiscussions);
    }, [state.spacesDiscussions])

    const handleOnClickSpaceDiscussion = (item: any) => {
        setOpen(false)
        router.push(`/space-discussion/${item.name}`)
        dispatch({
            type: 'setLoading',
            payload: {
                is: true,
                message: 'Loading space discussion'
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                className="p-0 border border-zinc-700 bg-black rounded-lg max-w-[520px] w-full shadow-lg"
            >
                {/* DialogTitle y DialogDescription existentes */}

                {/* DialogTitle ya existente */}
                <DialogTitle className="sr-only">
                    Buscar libros y salas de discusión
                </DialogTitle>

                {/* Añadir DialogDescription */}
                <DialogDescription className="sr-only">
                    Busca entre los libros y salas de discusión disponibles. Puedes filtrar por nombre.
                </DialogDescription>

                <div className="flex items-center px-3 py-3 border-b border-zinc-800">
                    <Search className="mr-4 h-6 w-6 text-zinc-400 shrink-0" />
                    <Input
                        placeholder="write a book or discussion room code"
                        className="text-xl border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder:text-zinc-400 h-auto p-0"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                    />
                    <Button
                        className="cursor-pointer ml-auto bg-white hover:bg-gray-100 text-black rounded-md font-medium px-4 h-8 shrink-0"
                    >
                        Buscar
                    </Button>
                </div>

                <div className="max-h-[500px] w-full overflow-x-hidden overflow-y-auto">
                    {results.map((result: any, index: number) => {
                        if (result.access === 'PRIVATE') return null; // Cambiar return; a return null;
                        return (
                            <div
                                onClick={() => handleOnClickSpaceDiscussion(result)}
                                key={result._id}
                                className={`hover:bg-neutral-900 cursor-pointer py-4 px-4 ${index !== results.length - 1 ? 'border-b border-zinc-800' : ''}`}
                            >
                                {/* Título con ícono */}
                                <div className="flex items-start mb-1">
                                    <FileText className="h-6 w-6 text-zinc-400 mr-2 mt-1 shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <div className="text-white text-xl font-medium truncate">{result.name}</div>
                                    </div>
                                </div>

                                {/* Host */}
                                <div className="flex items-center mb-1">
                                    <User className="h-6 w-6 text-zinc-400 mr-2 shrink-0" />
                                    <span className="text-zinc-400 text-lg truncate">{result?.userId?.email?.split('@')[0]?.toUpperCase()}</span>
                                </div>

                                {/* Public status */}
                                <div className="flex items-center">
                                    {result.access === 'PRIVATE' ? (
                                        <Lock className="h-6 w-6 text-zinc-400 mr-2 shrink-0" />
                                    ) : (
                                        <Globe className="h-6 w-6 text-zinc-400 mr-2 shrink-0" />
                                    )}
                                    <span className="text-zinc-400 text-lg">{result?.access}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </DialogContent>
        </Dialog>
    );
}