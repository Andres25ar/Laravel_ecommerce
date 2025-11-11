<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Muestra la lista de usuarios (vendedores y compradores).
     */
    public function index()
    {
        $users = User::query()
            // No mostrar al admin actual ni a otros admins
            ->whereDoesntHave('roles', function ($query) {
                $query->where('name', 'administrador');
            })
            ->with('roles:name') // Carga solo el nombre de los roles
            ->latest('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/users/index', [
            'users' => $users,
        ]);
    }

    /**
     * Actualiza el rol de un usuario (Comprador <-> Vendedor).
     */
    public function updateRole(Request $request, User $user)
    {
        // Doble chequeo para no cambiar el rol de un admin por accidente
        if ($user->hasRole('administrador')) {
            abort(403, 'No se puede modificar el rol de un Administrador.');
        }

        $request->validate([
            'role' => 'required|string|in:vendedor,comprador',
        ]);

        // 'syncRoles' quita todos los roles anteriores y asigna el nuevo.
        $user->syncRoles([$request->role]);

        return redirect()->back()->with('success', 'Rol de usuario actualizado.');
    }

    /**
     * Suspende (banea) a un usuario.
     */
    public function suspend(User $user)
    {
        if ($user->hasRole('administrador') || $user->id === Auth::id()) {
            abort(403, 'No te puedes suspender a ti mismo ni a otro admin.');
        }

        $user->update(['banned_at' => now()]); // Establece la fecha de baneo

        return redirect()->back()->with('success', 'Usuario suspendido.');
    }

    /**
     * Reactiva (quita baneo) a un usuario.
     */
    public function restore(User $user)
    {
        $user->update(['banned_at' => null]); // Limpia la fecha de baneo

        return redirect()->back()->with('success', 'Usuario reactivado.');
    }
}