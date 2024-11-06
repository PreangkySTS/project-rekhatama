<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function store(Request $request)
{
    // if (!in_array(Auth::user()->role->level, [10, 9])) {
    //     return response()->json(['message' => 'Unauthorized access'], 403);
    // }

    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users',
        'password' => 'required|string|min:8',
        'role_id' => 'required|exists:roles,id', // Foreign key ke tabel roles
    ]);

    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password), // Hash password
        'role_id' => $request->role_id,  // Role yang dipilih
    ]);

    $user = $user->load('role');  // Load relasi role

    return response()->json([
        'message' => 'User created successfully',
        'user' => [
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role->role_name,  // Menampilkan nama role
            'created_at' => $user->created_at,
            'updated_at' => $user->updated_at,
            'id' => $user->id,
        ]
    ], 201);
}

public function update(Request $request, $id)
    {
        // if (!in_array(Auth::user()->role->level, [10, 9])) {
        //     return response()->json(['message' => 'Unauthorized access'], 403);
        // }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id,
            'password' => 'nullable|string|min:8',
            'role_id' => 'required|exists:roles,id',
        ]);

        $user = User::findOrFail($id);
        $user->name = $request->name;
        $user->email = $request->email;

        //  kalau paswword di isi akan di hash
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->role_id = $request->role_id;
        $user->save();

        return response()->json(['message' => 'User updated successfully', 'user' => $user], 200);
    }

    public function destroy($id)
    {
        // if (!in_array(Auth::user()->role->level, [10, 9])) {
        //     return response()->json(['message' => 'Unauthorized access'], 403);
        // }

        $user = User::findOrFail($id);
        $user->delete();
        return response()->json(['message' => 'User deleted successfully'], 200);
    }

    public function updateRole(Request $request, $id)
    {
        // if (!in_array(Auth::user()->role->level, [10, 9])) {
        //     return response()->json(['message' => 'Unauthorized access'], 403);
        // }

        $request->validate([
            'role_name' => 'required|string|max:255',
            'level'=> 'required|string|max:255',
        ]);

        $role = Role::findOrFail($id);
        $role->name = $request->name;
        $role->email = $request->email;

        return response()->json(['message' => 'Update role', 'role' => $role], 200);
    }

public function storeRole(Request $request)
{
    // if (!in_array(Auth::user()->role->level, [10, 9])) {
    //     return response()->json(['message' => 'Unauthorized access'], 403);
    // }

    $request->validate([
        'role_name' => 'required|string|max:255|unique:roles',
        'level' => 'required|integer',
    ]);

    $role = Role::create([
        'role_name' => $request->role_name,
        'level' => $request->level,
    ]);

    return response()->json(['message' => 'Role created successfully', 'role' => $role], 201);
}

public function destroyRole($id)
{
    // if (!in_array(Auth::user()->role->level, [10, 9])) {
    //     return response()->json(['message' => 'Unauthorized access'], 403);
    // }

    $role = Role::findOrFail($id);
    $role->delete();

    return response()->json(['message' => 'role di hapus ygy'], 200);
}

    public function index()
    {
        $users = User::with('role')->get();

        return response()->json($users, 200);
    }

    public function indexRole() {
        $roles = Role::all();  // Mengambil semua data roles
        return response()->json($roles, 200);
    }

    public function show($id)
    {
        $user = User::with('role')->find($id);

        if ($user) {
            return response()->json($user, 200);
        } else {
            return response()->json(['error' => 'User not found'], 404);
        }
    }

    // persentase
    public function rolePercentages()
{
    // Ambil semua pengguna beserta role-nya
    $users = User::with('role')->get();

    // Hitung total pengguna
    $totalUsers = $users->count();

    // Hitung jumlah pengguna berdasarkan role_id
    $roleCounts = $users->groupBy('role_id')->map(function ($group) {
        return $group->count();
    });

    // Hitung persentase untuk setiap role
    $percentages = [];
    $roleNames = Role::pluck('role_name', 'id'); // Ambil role_name berdasarkan ID

    foreach ($roleCounts as $roleId => $count) {
        $roleName = $roleNames[$roleId] ?? 'Unknown Role'; // Dapatkan nama role
        $percentages[$roleName] = ($totalUsers > 0) ? ($count / $totalUsers) * 100 : 0;
    }

    // Cari role dengan jumlah pengguna terbanyak
    $mostPopularRoleId = $roleCounts->keys()->sortByDesc(function ($key) use ($roleCounts) {
        return $roleCounts[$key];
    })->first();

    $mostPopularRoleName = $roleNames[$mostPopularRoleId] ?? 'Unknown Role'; // Dapatkan nama role terpopuler

    return response()->json([
        'percentages' => $percentages,
        'most popular role' => $mostPopularRoleName,
    ]);
}
}
