<?php

namespace Database\Seeders\Gameleira;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class RestauranteSeeder extends Seeder
{
    public function run(): void
    {
        $esfirrasSalgadas = Category::firstOrCreate(['slug' => 'esfirras-salgadas'], ['name' => 'Esfirras Salgadas', 'description' => 'Esfirras assadas com recheios tradicionais', 'is_active' => true, 'sort_order' => 1]);
        $esfirrasDoces = Category::firstOrCreate(['slug' => 'esfirras-doces'], ['name' => 'Esfirras Doces', 'description' => 'Esfirras doces para sobremesa', 'is_active' => true, 'sort_order' => 2]);
        $pratos = Category::firstOrCreate(['slug' => 'pratos-individuais'], ['name' => 'Pratos Individuais', 'description' => 'Pratos completos para uma refeição especial', 'is_active' => true, 'sort_order' => 3]);
        $entradas = Category::firstOrCreate(['slug' => 'entradas'], ['name' => 'Entradas', 'description' => 'Para começar bem', 'is_active' => true, 'sort_order' => 4]);
        $porcoes = Category::firstOrCreate(['slug' => 'porcoes'], ['name' => 'Porções', 'description' => 'Porções para compartilhar', 'is_active' => true, 'sort_order' => 5]);
        $bebidas = Category::firstOrCreate(['slug' => 'bebidas-gameleira'], ['name' => 'Bebidas', 'description' => 'Bebidas geladas', 'is_active' => true, 'sort_order' => 6]);
        $cervejas = Category::firstOrCreate(['slug' => 'cervejas'], ['name' => 'Cervejas', 'description' => 'Cervejas especiais', 'is_active' => true, 'sort_order' => 7]);

        Product::updateOrCreate(['name' => 'Carne', 'category_id' => $esfirrasSalgadas->id], ['description' => 'Esfirra de carne temperada', 'price' => 9.00, 'is_active' => true, 'sort_order' => 1]);
        Product::updateOrCreate(['name' => 'Queijo', 'category_id' => $esfirrasSalgadas->id], ['description' => 'Esfirra de queijo derretido', 'price' => 9.00, 'is_active' => true, 'sort_order' => 2]);
        Product::updateOrCreate(['name' => 'Frango com Catupiry', 'category_id' => $esfirrasSalgadas->id], ['description' => 'Esfirra de frango desfiado com catupiry', 'price' => 9.00, 'is_active' => true, 'sort_order' => 3]);
        Product::updateOrCreate(['name' => 'Espinafre com Queijo', 'category_id' => $esfirrasSalgadas->id], ['description' => 'Esfirra de espinafre com queijo', 'price' => 9.00, 'is_active' => true, 'sort_order' => 4]);
        Product::updateOrCreate(['name' => 'Filé com Gorgonzola', 'category_id' => $esfirrasSalgadas->id], ['description' => 'Esfirra de filé mignon com gorgonzola', 'price' => 12.00, 'is_active' => true, 'sort_order' => 5]);
        Product::updateOrCreate(['name' => 'Camarão', 'category_id' => $esfirrasSalgadas->id], ['description' => 'Esfirra de camarão', 'price' => 12.00, 'is_active' => true, 'sort_order' => 6]);

        Product::updateOrCreate(['name' => 'Romeu e Julieta', 'category_id' => $esfirrasDoces->id], ['description' => 'Esfirra doce de goiabada com queijo', 'price' => 9.00, 'is_active' => true, 'sort_order' => 1]);
        Product::updateOrCreate(['name' => 'Nutella com Morango', 'category_id' => $esfirrasDoces->id], ['description' => 'Esfirra doce de Nutella com morango', 'price' => 12.00, 'is_active' => true, 'sort_order' => 2]);

        Product::updateOrCreate(['name' => 'Tilápia Grelhada com Legumes', 'category_id' => $pratos->id], ['description' => 'Acompanha arroz branco, vagem, cenoura, rabanete e abobrinha.', 'price' => 68.00, 'is_active' => true, 'sort_order' => 1]);
        Product::updateOrCreate(['name' => 'Espaguete ao Pomodoro', 'category_id' => $pratos->id], ['description' => 'Da casa com camarão VG.', 'price' => 82.00, 'is_active' => true, 'sort_order' => 2]);
        Product::updateOrCreate(['name' => 'Bacalhau à Lagareiro com Camarões', 'category_id' => $pratos->id], ['description' => 'Bacalhau assado no azeite com alho e batatas ao murro, finalizado com camarões selecionados. Acompanha arroz com brócolis.', 'price' => 98.00, 'is_active' => true, 'sort_order' => 3]);

        Product::updateOrCreate(['name' => 'Homus Tahine', 'category_id' => $entradas->id], ['description' => 'Pasta de grão de bico com tahine. Acompanha pão sírio.', 'price' => 46.00, 'is_active' => true, 'sort_order' => 1]);
        Product::updateOrCreate(['name' => 'Carpaccio', 'category_id' => $entradas->id], ['description' => 'Acompanha pão italiano, rúcula, molho de alcaparras e parmesão.', 'price' => 58.00, 'is_active' => true, 'sort_order' => 2]);

        Product::updateOrCreate(['name' => 'Pastel de Angu', 'category_id' => $porcoes->id], ['description' => '10 unidades.', 'price' => 42.00, 'is_active' => true, 'sort_order' => 1]);
        Product::updateOrCreate(['name' => 'Botequinho', 'category_id' => $porcoes->id], ['description' => 'Polenta frita, queijo da roça, linguiça caseira.', 'price' => 58.00, 'is_active' => true, 'sort_order' => 2]);
        Product::updateOrCreate(['name' => 'Bolinho de Bacalhau', 'category_id' => $porcoes->id], ['description' => '8 unidades.', 'price' => 58.00, 'is_active' => true, 'sort_order' => 3]);
        Product::updateOrCreate(['name' => 'Carne de Sol com Aipim', 'category_id' => $porcoes->id], ['description' => '350g de carne de sol + 300g de batatas fritas.', 'price' => 82.00, 'is_active' => true, 'sort_order' => 4]);
        Product::updateOrCreate(['name' => 'Filé com Fritas', 'category_id' => $porcoes->id], ['description' => '350g de filé mignon + 300g de batatas fritas.', 'price' => 92.00, 'is_active' => true, 'sort_order' => 5]);

        Product::updateOrCreate(['name' => 'Mamba Water s/ Gás', 'category_id' => $bebidas->id], ['description' => 'Água Mamba sem gás', 'price' => 7.00, 'is_active' => true, 'sort_order' => 1]);
        Product::updateOrCreate(['name' => 'Mamba Water c/ Gás', 'category_id' => $bebidas->id], ['description' => 'Água Mamba com gás', 'price' => 8.00, 'is_active' => true, 'sort_order' => 2]);
        Product::updateOrCreate(['name' => 'Água Mineral s/ Gás', 'category_id' => $bebidas->id], ['description' => 'Água mineral sem gás', 'price' => 5.00, 'is_active' => true, 'sort_order' => 3]);
        Product::updateOrCreate(['name' => 'Água Mineral c/ Gás', 'category_id' => $bebidas->id], ['description' => 'Água mineral com gás', 'price' => 6.00, 'is_active' => true, 'sort_order' => 4]);
        Product::updateOrCreate(['name' => 'Coca Cola Lata', 'category_id' => $bebidas->id], ['description' => 'Coca-Cola em lata 350ml', 'price' => 8.00, 'is_active' => true, 'sort_order' => 5]);
        Product::updateOrCreate(['name' => 'Guaraná Lata', 'category_id' => $bebidas->id], ['description' => 'Guaraná Antarctica em lata 350ml', 'price' => 8.00, 'is_active' => true, 'sort_order' => 6]);
        Product::updateOrCreate(['name' => 'Sprite Lata', 'category_id' => $bebidas->id], ['description' => 'Sprite em lata 350ml', 'price' => 8.00, 'is_active' => true, 'sort_order' => 7]);
        Product::updateOrCreate(['name' => 'Fanta Sabores Lata', 'category_id' => $bebidas->id], ['description' => 'Fanta em lata 350ml', 'price' => 8.00, 'is_active' => true, 'sort_order' => 8]);
        Product::updateOrCreate(['name' => 'Coca Cola 1,5L', 'category_id' => $bebidas->id], ['description' => 'Coca-Cola 1,5 litros', 'price' => 16.00, 'is_active' => true, 'sort_order' => 9]);
        Product::updateOrCreate(['name' => 'Guaraná 1,5L', 'category_id' => $bebidas->id], ['description' => 'Guaraná Antarctica 1,5 litros', 'price' => 16.00, 'is_active' => true, 'sort_order' => 10]);

        Product::updateOrCreate(['name' => 'Corona', 'category_id' => $cervejas->id], ['description' => 'Cerveja Corona 355ml', 'price' => 12.00, 'is_active' => true, 'sort_order' => 1]);
        Product::updateOrCreate(['name' => 'Heineken', 'category_id' => $cervejas->id], ['description' => 'Cerveja Heineken 330ml', 'price' => 12.00, 'is_active' => true, 'sort_order' => 2]);
        Product::updateOrCreate(['name' => 'Stella Pure Gold', 'category_id' => $cervejas->id], ['description' => 'Cerveja Stella Artois Pure Gold 330ml', 'price' => 12.00, 'is_active' => true, 'sort_order' => 3]);
        Product::updateOrCreate(['name' => 'Baden Baden', 'category_id' => $cervejas->id], ['description' => 'Cerveja Baden Baden 500ml', 'price' => 22.00, 'is_active' => true, 'sort_order' => 4]);
        Product::updateOrCreate(['name' => 'Ronchi', 'category_id' => $cervejas->id], ['description' => 'Cerveja Ronchi 600ml', 'price' => 24.00, 'is_active' => true, 'sort_order' => 5]);
    }
}
