import { useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Paginator, User, PageProps as BasePageProps } from '@/types';
import AdminUserController from '@/actions/App/Http/Controllers/Admin/UserController';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { MoreHorizontal, UserCheck, UserCog, UserX, CheckSquare } from 'lucide-react';
import Pagination from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// Props que la página recibe del controlador
interface IndexProps extends BasePageProps {
    users: Paginator<User>;
}

export default function UsersIndex() {
    const { users } = usePage<IndexProps>().props;

    // Estados para los diálogos de confirmación
    const [alertOpen, setAlertOpen] = useState(false);
    const [actionUser, setActionUser] = useState<User | null>(null);
    const [actionType, setActionType] = useState<'suspend' | 'restore' | null>(null);

    // Función para cambiar rol (POST no, PUT/PATCH es mejor para "actualizar")
    const handleChangeRole = (user: User, newRole: 'vendedor' | 'comprador') => {
        router.put(AdminUserController.updateRole.url(user.id), {
            role: newRole
        }, {
            preserveScroll: true,
            onSuccess: () => toast.success(`Rol de ${user.name} actualizado.`),
            onError: () => toast.error('Error al actualizar el rol.'),
        });
    };

    // Abre el diálogo de confirmación
    const openConfirmation = (user: User, type: 'suspend' | 'restore') => {
        setActionUser(user);
        setActionType(type);
        setAlertOpen(true);
    };

    // Ejecuta la acción (suspender/reactivar)
    const executeAction = () => {
        if (!actionUser || !actionType) return;

        const url = actionType === 'suspend'
            ? AdminUserController.suspend.url(actionUser.id)
            : AdminUserController.restore.url(actionUser.id);

        router.post(url, {}, {
            preserveScroll: true,
            onSuccess: () => toast.success(`Usuario ${actionType === 'suspend' ? 'suspendido' : 'reactivado'}.`),
            onError: () => toast.error('Error al ejecutar la acción.'),
            onFinish: () => {
                setAlertOpen(false);
                setActionUser(null);
                setActionType(null);
            }
        });
    };

    // Helper para obtener el rol principal del usuario
    const getUserRole = (user: User) => {
        if (user.roles?.some(role => role.name === 'vendedor')) return 'vendedor';
        return 'comprador';
    };

    return (
        <AppLayout>
            <Head title="Administrar Usuarios" />

            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold">Administrar Usuarios</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Todos los Usuarios (Vendedores y Compradores)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nombre</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Rol Actual</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead className="text-right w-[100px]">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.data.length > 0 ? (
                                        users.data.map((user) => {
                                            const role = getUserRole(user);
                                            const isSuspended = !!user.banned_at;

                                            return (
                                                <TableRow key={user.id}>
                                                    <TableCell className="font-medium">{user.name}</TableCell>
                                                    <TableCell>{user.email}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={role === 'vendedor' ? 'default' : 'outline'}>
                                                            {role}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {isSuspended && (
                                                            <Badge variant="destructive">Suspendido</Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <AlertDialog open={alertOpen && actionUser?.id === user.id} onOpenChange={setAlertOpen}>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="icon">
                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    {/* Acciones de Rol */}
                                                                    {role === 'comprador' && (
                                                                        <DropdownMenuItem onSelect={() => handleChangeRole(user, 'vendedor')}>
                                                                            <UserCog className="mr-2 h-4 w-4" />
                                                                            Hacer Vendedor
                                                                        </DropdownMenuItem>
                                                                    )}
                                                                    {role === 'vendedor' && (
                                                                        <DropdownMenuItem onSelect={() => handleChangeRole(user, 'comprador')}>
                                                                            <UserCheck className="mr-2 h-4 w-4" />
                                                                            Hacer Comprador
                                                                        </DropdownMenuItem>
                                                                    )}
                                                                    <DropdownMenuSeparator />

                                                                    {/* Acciones de Suspensión */}
                                                                    <AlertDialogTrigger asChild>
                                                                        {isSuspended ? (
                                                                            <DropdownMenuItem onSelect={() => openConfirmation(user, 'restore')}>
                                                                                <CheckSquare className="mr-2 h-4 w-4 text-green-500" />
                                                                                Reactivar Usuario
                                                                            </DropdownMenuItem>
                                                                        ) : (
                                                                            <DropdownMenuItem onSelect={() => openConfirmation(user, 'suspend')} className="text-destructive focus:text-destructive">
                                                                                <UserX className="mr-2 h-4 w-4" />
                                                                                Suspender Usuario
                                                                            </DropdownMenuItem>
                                                                        )}
                                                                    </AlertDialogTrigger>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>

                                                            {/* Contenido del Diálogo */}
                                                            {actionUser && (
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            {actionType === 'suspend'
                                                                                ? `Esto suspenderá a ${actionUser.name} y no podrá iniciar sesión.`
                                                                                : `Esto reactivará a ${actionUser.name} y podrá volver a usar la plataforma.`}
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel onClick={() => setAlertOpen(false)}>Cancelar</AlertDialogCancel>
                                                                        <AlertDialogAction
                                                                            onClick={executeAction}
                                                                            className={actionType === 'suspend' ? 'bg-destructive hover:bg-destructive/90' : ''}
                                                                        >
                                                                            Confirmar
                                                                        </AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            )}
                                                        </AlertDialog>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center h-24">
                                                No se encontraron usuarios.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                <Pagination links={users.links} className="mt-6" />
            </div>
        </AppLayout>
    );
}