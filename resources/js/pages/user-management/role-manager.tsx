import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Permission, Role, type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { KeyIcon, PencilIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Role Manager',
        href: '/roles',
    },
];

interface Props {
    roles: Role[];
    permissions: Permission[];
}

export default function RoleManagerPage({ roles, permissions }: Props) {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [permissionRole, setPermissionRole] = useState<Role | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        guard_name: 'web',
    });
    const {
        data: editData,
        setData: setEditData,
        put,
        processing: editProcessing,
        errors: editErrors,
        reset: resetEdit,
    } = useForm({
        name: '',
        guard_name: 'web',
    });

    const {
        data: permissionData,
        setData: setPermissionData,
        post: postPermissions,
        processing: permissionProcessing,
        reset: resetPermissions,
    } = useForm({
        permissions: [] as number[],
    });
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('user-management.roles.store'), {
            onSuccess: () => {
                reset();
                setIsCreateDialogOpen(false);
            },
        });
    };

    const handleEdit = (role: Role) => {
        setEditingRole(role);
        setEditData({
            name: role.name,
            guard_name: role.guard_name,
        });
        setIsEditDialogOpen(true);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingRole) return;

        put(route('user-management.roles.update', editingRole.id), {
            onSuccess: () => {
                resetEdit();
                setIsEditDialogOpen(false);
                setEditingRole(null);
            },
        });
    };
    const handleDelete = (role: Role) => {
        if (confirm(`Are you sure you want to delete the role "${role.name}"?`)) {
            router.delete(route('user-management.roles.destroy', role.id));
        }
    };

    const handleManagePermissions = (role: Role) => {
        setPermissionRole(role);
        const rolePermissionIds = role.permissions?.map((p) => p.id) || [];
        setPermissionData('permissions', rolePermissionIds);
        setIsPermissionDialogOpen(true);
    };

    const handlePermissionSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!permissionRole) return;

        postPermissions(route('user-management.roles.assign-permissions', permissionRole.id), {
            onSuccess: () => {
                resetPermissions();
                setIsPermissionDialogOpen(false);
                setPermissionRole(null);
            },
        });
    };

    const handlePermissionChange = (permissionId: number, checked: boolean) => {
        const currentPermissions = permissionData.permissions;
        if (checked) {
            setPermissionData('permissions', [...currentPermissions, permissionId]);
        } else {
            setPermissionData(
                'permissions',
                currentPermissions.filter((id) => id !== permissionId),
            );
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Role Manager" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Role Manager</h1>
                        <p className="text-muted-foreground">Manage system roles and permissions</p>
                    </div>

                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <PlusIcon className="mr-2 h-4 w-4" />
                                Create Role
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Create New Role</DialogTitle>
                                <DialogDescription>Create a new role for the application. Enter a unique name for the role.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit}>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">
                                            Name
                                        </Label>
                                        <div className="col-span-3">
                                            <Input
                                                id="name"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                placeholder="Enter role name"
                                                className={errors.name ? 'border-red-500' : ''}
                                            />
                                            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="guard_name" className="text-right">
                                            Guard
                                        </Label>
                                        <div className="col-span-3">
                                            <Input
                                                id="guard_name"
                                                value={data.guard_name}
                                                onChange={(e) => setData('guard_name', e.target.value)}
                                                placeholder="web"
                                                className={errors.guard_name ? 'border-red-500' : ''}
                                            />
                                            {errors.guard_name && <p className="mt-1 text-sm text-red-500">{errors.guard_name}</p>}
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Creating...' : 'Create Role'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>{' '}
                    </Dialog>

                    {/* Edit Role Dialog */}
                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Edit Role</DialogTitle>
                                <DialogDescription>Edit the role details. Make sure the name is unique.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleEditSubmit}>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="edit-name" className="text-right">
                                            Name
                                        </Label>
                                        <div className="col-span-3">
                                            <Input
                                                id="edit-name"
                                                value={editData.name}
                                                onChange={(e) => setEditData('name', e.target.value)}
                                                placeholder="Enter role name"
                                                className={editErrors.name ? 'border-red-500' : ''}
                                            />
                                            {editErrors.name && <p className="mt-1 text-sm text-red-500">{editErrors.name}</p>}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="edit-guard_name" className="text-right">
                                            Guard
                                        </Label>
                                        <div className="col-span-3">
                                            <Input
                                                id="edit-guard_name"
                                                value={editData.guard_name}
                                                onChange={(e) => setEditData('guard_name', e.target.value)}
                                                placeholder="web"
                                                className={editErrors.guard_name ? 'border-red-500' : ''}
                                            />
                                            {editErrors.guard_name && <p className="mt-1 text-sm text-red-500">{editErrors.guard_name}</p>}
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={editProcessing}>
                                        {editProcessing ? 'Updating...' : 'Update Role'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>{' '}
                    </Dialog>

                    {/* Permissions Dialog */}
                    <Dialog open={isPermissionDialogOpen} onOpenChange={setIsPermissionDialogOpen}>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Manage Permissions</DialogTitle>
                                <DialogDescription>
                                    Assign permissions to the role "{permissionRole?.name}". Select the permissions you want to grant to this role.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handlePermissionSubmit}>
                                <div className="grid max-h-96 gap-4 overflow-y-auto py-4">
                                    {permissions.map((permission) => (
                                        <div key={permission.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`permission-${permission.id}`}
                                                checked={permissionData.permissions.includes(permission.id)}
                                                onCheckedChange={(checked) => handlePermissionChange(permission.id, checked as boolean)}
                                            />
                                            <Label htmlFor={`permission-${permission.id}`} className="text-sm font-normal">
                                                {permission.name}
                                            </Label>
                                        </div>
                                    ))}
                                    {permissions.length === 0 && (
                                        <p className="text-muted-foreground text-center">No permissions available. Create some permissions first.</p>
                                    )}
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setIsPermissionDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={permissionProcessing}>
                                        {permissionProcessing ? 'Assigning...' : 'Assign Permissions'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="grid gap-4">
                    <div className="rounded-lg border">
                        <div className="p-4">
                            <h2 className="text-lg font-semibold">Existing Roles</h2>
                            <p className="text-muted-foreground text-sm">Manage and view all system roles</p>
                        </div>
                        <div className="border-t">
                            {roles.length > 0 ? (
                                <div className="divide-y">
                                    {roles.map((role) => (
                                        <div key={role.id} className="flex items-center justify-between p-4">
                                            <div>
                                                <h3 className="font-medium">{role.name}</h3>
                                                <p className="text-muted-foreground text-sm">
                                                    Guard: {role.guard_name} • Permissions: {role.permissions?.length || 0}
                                                </p>
                                            </div>{' '}
                                            <div className="flex items-center gap-2">
                                                <Button variant="outline" size="sm" onClick={() => handleManagePermissions(role)}>
                                                    <KeyIcon className="h-4 w-4" />
                                                </Button>
                                                <Button variant="outline" size="sm" onClick={() => handleEdit(role)}>
                                                    <PencilIcon className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDelete(role)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2Icon className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center">
                                    <p className="text-muted-foreground">No roles found. Create your first role to get started.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
