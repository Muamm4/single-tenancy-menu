<?php

namespace Database\Seeders\Default;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class RestauranteSeeder extends Seeder
{
    public function run(): void
    {
        $hamburgueres = Category::firstOrCreate(
            ['slug' => 'hamburgueres'],
            ['name' => 'Hambúrgueres', 'description' => 'Hambúrgueres artesanais', 'is_active' => true, 'sort_order' => 1]
        );
        $porcoes = Category::firstOrCreate(
            ['slug' => 'porcoes-default'],
            ['name' => 'Porções', 'description' => 'Porções para compartilhar', 'is_active' => true, 'sort_order' => 2]
        );
        $bebidas = Category::firstOrCreate(
            ['slug' => 'bebidas-default'],
            ['name' => 'Bebidas', 'description' => 'Bebidas e refrigerantes', 'is_active' => true, 'sort_order' => 3]
        );
        $sobremesas = Category::firstOrCreate(
            ['slug' => 'sobremesas-default'],
            ['name' => 'Sobremesas', 'description' => 'Doces e sobremesas', 'is_active' => true, 'sort_order' => 4]
        );

        Product::updateOrCreate(['name' => 'Cheese Burger', 'category_id' => $hamburgueres->id], ['description' => 'Pão, blend 150g, queijo cheddar, alface, tomate', 'price' => 32.00, 'is_active' => true, 'sort_order' => 1]);
        Product::updateOrCreate(['name' => 'Bacon Burger', 'category_id' => $hamburgueres->id], ['description' => 'Pão, blend 150g, bacon crocante, cheddar, alface, tomate', 'price' => 36.00, 'is_active' => true, 'sort_order' => 2]);
        Product::updateOrCreate(['name' => 'Chicken Burger', 'category_id' => $hamburgueres->id], ['description' => 'Pão, filé de frango empanado, alface, tomate, maionese', 'price' => 30.00, 'is_active' => true, 'sort_order' => 3]);

        Product::updateOrCreate(['name' => 'Batata Frita', 'category_id' => $porcoes->id], ['description' => 'Batata frita crocante', 'price' => 16.00, 'is_active' => true, 'sort_order' => 1]);
        Product::updateOrCreate(['name' => 'Anéis de Cebola', 'category_id' => $porcoes->id], ['description' => 'Anéis de cebola empanados', 'price' => 18.00, 'is_active' => true, 'sort_order' => 2]);
        Product::updateOrCreate(['name' => 'Frango a Passarinho', 'category_id' => $porcoes->id], ['description' => 'Frango temperado e frito', 'price' => 28.00, 'is_active' => true, 'sort_order' => 3]);
        Product::updateOrCreate(['name' => 'Calabresa Acebolada', 'category_id' => $porcoes->id], ['description' => 'Calabresa frita com cebola', 'price' => 25.00, 'is_active' => true, 'sort_order' => 4]);

        Product::updateOrCreate(['name' => 'Água Mineral s/ Gás', 'category_id' => $bebidas->id], ['price' => 4.00, 'is_active' => true, 'sort_order' => 1]);
        Product::updateOrCreate(['name' => 'Água Mineral c/ Gás', 'category_id' => $bebidas->id], ['price' => 5.00, 'is_active' => true, 'sort_order' => 2]);
        Product::updateOrCreate(['name' => 'Coca Cola Lata', 'category_id' => $bebidas->id], ['price' => 8.00, 'is_active' => true, 'sort_order' => 3]);
        Product::updateOrCreate(['name' => 'Guaraná Lata', 'category_id' => $bebidas->id], ['price' => 8.00, 'is_active' => true, 'sort_order' => 4]);
        Product::updateOrCreate(['name' => 'Suco Natural 300ml', 'category_id' => $bebidas->id], ['price' => 10.00, 'is_active' => true, 'sort_order' => 5]);

        Product::updateOrCreate(['name' => 'Pudim', 'category_id' => $sobremesas->id], ['price' => 14.00, 'is_active' => true, 'sort_order' => 1]);
        Product::updateOrCreate(['name' => 'Brownie com Sorvete', 'category_id' => $sobremesas->id], ['price' => 18.00, 'is_active' => true, 'sort_order' => 2]);

        $this->command->info('Default: ' . (4 + 12) . ' items seeded successfully');
    }
}
