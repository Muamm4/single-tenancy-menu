<?php

namespace Database\Seeders\Hamburgueria;

use App\Models\Addon;
use App\Models\AddonCategory;
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
        $assados = Category::firstOrCreate(
            ['slug' => 'assados-na-parrilla'],
            ['name' => 'Assados na Parrilla', 'description' => 'Carnes assadas na parrilla', 'is_active' => true, 'sort_order' => 2]
        );
        $acompanhamentos = Category::firstOrCreate(
            ['slug' => 'acompanhamentos'],
            ['name' => 'Acompanhamentos', 'description' => 'Acompanhamentos e porções', 'is_active' => true, 'sort_order' => 3]
        );
        $bebidas = Category::firstOrCreate(
            ['slug' => 'bebidas-hamburgueria'],
            ['name' => 'Bebidas', 'description' => 'Bebidas e chopp', 'is_active' => true, 'sort_order' => 4]
        );
        $sobremesa = Category::firstOrCreate(
            ['slug' => 'sobremesa-hamburgueria'],
            ['name' => 'Sobremesa', 'description' => 'Doces e sobremesas', 'is_active' => true, 'sort_order' => 5]
        );

        Product::updateOrCreate(['name' => 'Cheese Bacon Burger', 'category_id' => $hamburgueres->id], ['description' => 'Pão, Blend 150g, Bacon, Cheddar, Alface, Tomate e Cebola Roxa.', 'price' => 38.00, 'is_active' => true, 'sort_order' => 1]);
        Product::updateOrCreate(['name' => 'Double Burger', 'category_id' => $hamburgueres->id], ['description' => 'Pão, 2x Blend 150g, 2x Bacon, 2x Cheddar, Alface, Cebola Roxa e Tomate.', 'price' => 50.00, 'is_active' => true, 'sort_order' => 2]);
        $monteSeu = Product::updateOrCreate(['name' => 'Monte o Seu', 'category_id' => $hamburgueres->id], ['description' => 'Pão, Blend 150g, Alface, Tomate... Monte seu hambúrguer com os adicionais que preferir!', 'price' => 32.00, 'is_active' => true, 'sort_order' => 3]);

        Product::updateOrCreate(['name' => 'Picanha', 'category_id' => $assados->id], ['description' => '250g de picanha, batata frita, chimichurri, farofa e vinagrete.', 'price' => 79.00, 'is_active' => true, 'sort_order' => 1]);
        Product::updateOrCreate(['name' => 'Ancho / Chorizo', 'category_id' => $assados->id], ['description' => '250g de Ancho ou Chorizo, batata frita, chimichurri, farofa e vinagrete.', 'price' => 68.00, 'is_active' => true, 'sort_order' => 2]);
        Product::updateOrCreate(['name' => 'Choripan', 'category_id' => $assados->id], ['description' => 'Pão francês, linguiça, chimichurri e vinagrete.', 'price' => 20.00, 'is_active' => true, 'sort_order' => 3]);

        Product::updateOrCreate(['name' => 'Batata Frita', 'category_id' => $acompanhamentos->id], ['price' => 14.00, 'is_active' => true, 'sort_order' => 1]);
        Product::updateOrCreate(['name' => 'Batata Frita Apimentada', 'category_id' => $acompanhamentos->id], ['price' => 16.00, 'is_active' => true, 'sort_order' => 2]);
        Product::updateOrCreate(['name' => 'Batata Frita c/ Parmesão', 'category_id' => $acompanhamentos->id], ['price' => 25.00, 'is_active' => true, 'sort_order' => 3]);
        Product::updateOrCreate(['name' => 'Arroz', 'category_id' => $acompanhamentos->id], ['price' => 10.00, 'is_active' => true, 'sort_order' => 4]);
        Product::updateOrCreate(['name' => 'Farofa', 'category_id' => $acompanhamentos->id], ['price' => 12.00, 'is_active' => true, 'sort_order' => 5]);
        Product::updateOrCreate(['name' => 'Vinagrete', 'category_id' => $acompanhamentos->id], ['price' => 12.00, 'is_active' => true, 'sort_order' => 6]);
        Product::updateOrCreate(['name' => 'Combo (Batata Frita + Refrigerante Lata)', 'category_id' => $acompanhamentos->id], ['price' => 18.00, 'is_active' => true, 'sort_order' => 7]);

        Product::updateOrCreate(['name' => 'Água sem Gás 500ml', 'category_id' => $bebidas->id], ['price' => 4.00, 'is_active' => true, 'sort_order' => 1]);
        Product::updateOrCreate(['name' => 'Água com Gás 500ml', 'category_id' => $bebidas->id], ['price' => 5.00, 'is_active' => true, 'sort_order' => 2]);
        Product::updateOrCreate(['name' => 'Suco Natural 300ml', 'category_id' => $bebidas->id], ['price' => 10.00, 'is_active' => true, 'sort_order' => 3]);
        Product::updateOrCreate(['name' => 'Coca Cola Lata', 'category_id' => $bebidas->id], ['price' => 8.00, 'is_active' => true, 'sort_order' => 4]);
        Product::updateOrCreate(['name' => 'Refrigerante Sabores Lata', 'category_id' => $bebidas->id], ['price' => 8.00, 'is_active' => true, 'sort_order' => 5]);
        Product::updateOrCreate(['name' => 'Coca Cola Zero Lata', 'category_id' => $bebidas->id], ['price' => 8.00, 'is_active' => true, 'sort_order' => 6]);
        Product::updateOrCreate(['name' => 'Coca Cola 1,5L', 'category_id' => $bebidas->id], ['price' => 14.00, 'is_active' => true, 'sort_order' => 7]);
        Product::updateOrCreate(['name' => 'Coca Cola 1,5L Zero', 'category_id' => $bebidas->id], ['price' => 14.00, 'is_active' => true, 'sort_order' => 8]);
        Product::updateOrCreate(['name' => 'Brahma Chopp Long Neck', 'category_id' => $bebidas->id], ['price' => 10.00, 'is_active' => true, 'sort_order' => 9]);
        Product::updateOrCreate(['name' => 'Heineken Long Neck', 'category_id' => $bebidas->id], ['price' => 12.00, 'is_active' => true, 'sort_order' => 10]);
        Product::updateOrCreate(['name' => 'Stella Gold Long Neck', 'category_id' => $bebidas->id], ['price' => 12.00, 'is_active' => true, 'sort_order' => 11]);
        Product::updateOrCreate(['name' => 'Skol Beats Long Neck', 'category_id' => $bebidas->id], ['price' => 14.00, 'is_active' => true, 'sort_order' => 12]);
        Product::updateOrCreate(['name' => 'Lagunitas IPA Long Neck', 'category_id' => $bebidas->id], ['price' => 16.00, 'is_active' => true, 'sort_order' => 13]);

        Product::updateOrCreate(['name' => 'Churros', 'category_id' => $sobremesa->id], ['price' => 25.00, 'is_active' => true, 'sort_order' => 1]);

        $monteSeuCategory = AddonCategory::updateOrCreate(
            ['name' => 'Monte o seu'],
            ['min_select' => 0, 'max_select' => 0, 'is_active' => true, 'sort_order' => 1]
        );

        $addons = [
            ['name' => 'Rúcula', 'price' => 2.00, 'sort_order' => 1],
            ['name' => 'Cebola Roxa', 'price' => 2.00, 'sort_order' => 2],
            ['name' => 'Cebola Grelhada', 'price' => 3.00, 'sort_order' => 3],
            ['name' => 'Banana Frita', 'price' => 3.00, 'sort_order' => 4],
            ['name' => 'Gorgonzola', 'price' => 6.00, 'sort_order' => 5],
            ['name' => 'Bacon', 'price' => 4.00, 'sort_order' => 6],
            ['name' => 'Mostarda com Mel', 'price' => 4.00, 'sort_order' => 7],
            ['name' => 'Molho Especial', 'price' => 4.00, 'sort_order' => 8],
            ['name' => 'Picles', 'price' => 4.00, 'sort_order' => 9],
            ['name' => 'Cheddar', 'price' => 4.00, 'sort_order' => 10],
            ['name' => 'Mussarela', 'price' => 4.00, 'sort_order' => 11],
            ['name' => 'Cream Cheese', 'price' => 6.00, 'sort_order' => 12],
            ['name' => 'Cream Cheese c/ Repolho', 'price' => 8.00, 'sort_order' => 13],
            ['name' => 'Blend 150g', 'price' => 14.00, 'sort_order' => 14],
            ['name' => 'Chimichurri', 'price' => 3.00, 'sort_order' => 15],
            ['name' => 'Farofa', 'price' => 5.00, 'sort_order' => 16],
        ];

        foreach ($addons as $data) {
            Addon::updateOrCreate(
                ['addon_category_id' => $monteSeuCategory->id, 'name' => $data['name']],
                ['price' => $data['price'], 'is_active' => true, 'sort_order' => $data['sort_order']]
            );
        }

        if (!$monteSeu->addonCategories()->where('addon_category_id', $monteSeuCategory->id)->exists()) {
            $monteSeu->addonCategories()->attach($monteSeuCategory->id);
        }

        $this->command->info('Hamburgueria: ' . (5 + 28 + 16) . ' items seeded successfully');
    }
}
