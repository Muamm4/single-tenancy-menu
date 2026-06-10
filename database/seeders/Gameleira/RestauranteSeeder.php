<?php

namespace Database\Seeders\Gameleira;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class RestauranteSeeder extends Seeder
{
    public function run(): void
    {
        // ========== CATEGORIAS ==========
        $esfirrasSalgadas = Category::create([
            'name' => 'Esfirras Salgadas',
            'slug' => 'esfirras-salgadas',
            'description' => 'Esfirras assadas com recheios tradicionais',
            'is_active' => true,
            'sort_order' => 1,
        ]);
        $esfirrasDoces = Category::create([
            'name' => 'Esfirras Doces',
            'slug' => 'esfirras-doces',
            'description' => 'Esfirras doces para sobremesa',
            'is_active' => true,
            'sort_order' => 2,
        ]);
        $pratos = Category::create([
            'name' => 'Pratos Individuais',
            'slug' => 'pratos-individuais',
            'description' => 'Pratos completos para uma refeição especial',
            'is_active' => true,
            'sort_order' => 3,
        ]);
        $entradas = Category::create([
            'name' => 'Entradas',
            'slug' => 'entradas',
            'description' => 'Para começar bem',
            'is_active' => true,
            'sort_order' => 4,
        ]);
        $porcoes = Category::create([
            'name' => 'Porções',
            'slug' => 'porcoes',
            'description' => 'Porções para compartilhar',
            'is_active' => true,
            'sort_order' => 5,
        ]);
        $bebidas = Category::create([
            'name' => 'Bebidas',
            'slug' => 'bebidas',
            'description' => 'Bebidas geladas',
            'is_active' => true,
            'sort_order' => 6,
        ]);
        $cervejas = Category::create([
            'name' => 'Cervejas',
            'slug' => 'cervejas',
            'description' => 'Cervejas especiais',
            'is_active' => true,
            'sort_order' => 7,
        ]);

        // ========== ESFIRRAS SALGADAS ==========
        Product::create(['category_id' => $esfirrasSalgadas->id, 'name' => 'Carne', 'description' => 'Esfirra de carne temperada', 'price' => 9.00, 'is_active' => true, 'sort_order' => 1]);
        Product::create(['category_id' => $esfirrasSalgadas->id, 'name' => 'Queijo', 'description' => 'Esfirra de queijo derretido', 'price' => 9.00, 'is_active' => true, 'sort_order' => 2]);
        Product::create(['category_id' => $esfirrasSalgadas->id, 'name' => 'Frango com Catupiry', 'description' => 'Esfirra de frango desfiado com catupiry', 'price' => 9.00, 'is_active' => true, 'sort_order' => 3]);
        Product::create(['category_id' => $esfirrasSalgadas->id, 'name' => 'Espinafre com Queijo', 'description' => 'Esfirra de espinafre com queijo', 'price' => 9.00, 'is_active' => true, 'sort_order' => 4]);
        Product::create(['category_id' => $esfirrasSalgadas->id, 'name' => 'Filé com Gorgonzola', 'description' => 'Esfirra de filé mignon com gorgonzola', 'price' => 12.00, 'is_active' => true, 'sort_order' => 5]);
        Product::create(['category_id' => $esfirrasSalgadas->id, 'name' => 'Camarão', 'description' => 'Esfirra de camarão', 'price' => 12.00, 'is_active' => true, 'sort_order' => 6]);

        // ========== ESFIRRAS DOCES ==========
        Product::create(['category_id' => $esfirrasDoces->id, 'name' => 'Romeu e Julieta', 'description' => 'Esfirra doce de goiabada com queijo', 'price' => 9.00, 'is_active' => true, 'sort_order' => 1]);
        Product::create(['category_id' => $esfirrasDoces->id, 'name' => 'Nutella com Morango', 'description' => 'Esfirra doce de Nutella com morango', 'price' => 12.00, 'is_active' => true, 'sort_order' => 2]);

        // ========== PRATOS INDIVIDUAIS ==========
        Product::create(['category_id' => $pratos->id, 'name' => 'Tilápia Grelhada com Legumes', 'description' => 'Acompanha arroz branco, vagem, cenoura, rabanete e abobrinha.', 'price' => 68.00, 'is_active' => true, 'sort_order' => 1]);
        Product::create(['category_id' => $pratos->id, 'name' => 'Espaguete ao Pomodoro', 'description' => 'Da casa com camarão VG.', 'price' => 82.00, 'is_active' => true, 'sort_order' => 2]);
        Product::create(['category_id' => $pratos->id, 'name' => 'Bacalhau à Lagareiro com Camarões', 'description' => 'Bacalhau assado no azeite com alho e batatas ao murro, finalizado com camarões selecionados. Acompanha arroz com brócolis.', 'price' => 98.00, 'is_active' => true, 'sort_order' => 3]);

        // ========== ENTRADAS ==========
        Product::create(['category_id' => $entradas->id, 'name' => 'Homus Tahine', 'description' => 'Pasta de grão de bico com tahine. Acompanha pão sírio.', 'price' => 46.00, 'is_active' => true, 'sort_order' => 1]);
        Product::create(['category_id' => $entradas->id, 'name' => 'Carpaccio', 'description' => 'Acompanha pão italiano, rúcula, molho de alcaparras e parmesão.', 'price' => 58.00, 'is_active' => true, 'sort_order' => 2]);

        // ========== PORÇÕES ==========
        Product::create(['category_id' => $porcoes->id, 'name' => 'Pastel de Angu', 'description' => '10 unidades.', 'price' => 42.00, 'is_active' => true, 'sort_order' => 1]);
        Product::create(['category_id' => $porcoes->id, 'name' => 'Botequinho', 'description' => 'Polenta frita, queijo da roça, linguiça caseira.', 'price' => 58.00, 'is_active' => true, 'sort_order' => 2]);
        Product::create(['category_id' => $porcoes->id, 'name' => 'Bolinho de Bacalhau', 'description' => '8 unidades.', 'price' => 58.00, 'is_active' => true, 'sort_order' => 3]);
        Product::create(['category_id' => $porcoes->id, 'name' => 'Carne de Sol com Aipim', 'description' => '350g de carne de sol + 300g de batatas fritas.', 'price' => 82.00, 'is_active' => true, 'sort_order' => 4]);
        Product::create(['category_id' => $porcoes->id, 'name' => 'Filé com Fritas', 'description' => '350g de filé mignon + 300g de batatas fritas.', 'price' => 92.00, 'is_active' => true, 'sort_order' => 5]);

        // ========== BEBIDAS ==========
        Product::create(['category_id' => $bebidas->id, 'name' => 'Mamba Water s/ Gás', 'description' => 'Água Mamba sem gás', 'price' => 7.00, 'is_active' => true, 'sort_order' => 1]);
        Product::create(['category_id' => $bebidas->id, 'name' => 'Mamba Water c/ Gás', 'description' => 'Água Mamba com gás', 'price' => 8.00, 'is_active' => true, 'sort_order' => 2]);
        Product::create(['category_id' => $bebidas->id, 'name' => 'Água Mineral s/ Gás', 'description' => 'Água mineral sem gás', 'price' => 5.00, 'is_active' => true, 'sort_order' => 3]);
        Product::create(['category_id' => $bebidas->id, 'name' => 'Água Mineral c/ Gás', 'description' => 'Água mineral com gás', 'price' => 6.00, 'is_active' => true, 'sort_order' => 4]);
        Product::create(['category_id' => $bebidas->id, 'name' => 'Coca Cola Lata', 'description' => 'Coca-Cola em lata 350ml', 'price' => 8.00, 'is_active' => true, 'sort_order' => 5]);
        Product::create(['category_id' => $bebidas->id, 'name' => 'Guaraná Lata', 'description' => 'Guaraná Antarctica em lata 350ml', 'price' => 8.00, 'is_active' => true, 'sort_order' => 6]);
        Product::create(['category_id' => $bebidas->id, 'name' => 'Sprite Lata', 'description' => 'Sprite em lata 350ml', 'price' => 8.00, 'is_active' => true, 'sort_order' => 7]);
        Product::create(['category_id' => $bebidas->id, 'name' => 'Fanta Sabores Lata', 'description' => 'Fanta em lata 350ml', 'price' => 8.00, 'is_active' => true, 'sort_order' => 8]);
        Product::create(['category_id' => $bebidas->id, 'name' => 'Coca Cola 1,5L', 'description' => 'Coca-Cola 1,5 litros', 'price' => 16.00, 'is_active' => true, 'sort_order' => 9]);
        Product::create(['category_id' => $bebidas->id, 'name' => 'Guaraná 1,5L', 'description' => 'Guaraná Antarctica 1,5 litros', 'price' => 16.00, 'is_active' => true, 'sort_order' => 10]);

        // ========== CERVEJAS ==========
        Product::create(['category_id' => $cervejas->id, 'name' => 'Corona', 'description' => 'Cerveja Corona 355ml', 'price' => 12.00, 'is_active' => true, 'sort_order' => 1]);
        Product::create(['category_id' => $cervejas->id, 'name' => 'Heineken', 'description' => 'Cerveja Heineken 330ml', 'price' => 12.00, 'is_active' => true, 'sort_order' => 2]);
        Product::create(['category_id' => $cervejas->id, 'name' => 'Stella Pure Gold', 'description' => 'Cerveja Stella Artois Pure Gold 330ml', 'price' => 12.00, 'is_active' => true, 'sort_order' => 3]);
        Product::create(['category_id' => $cervejas->id, 'name' => 'Baden Baden', 'description' => 'Cerveja Baden Baden 500ml', 'price' => 22.00, 'is_active' => true, 'sort_order' => 4]);
        Product::create(['category_id' => $cervejas->id, 'name' => 'Ronchi', 'description' => 'Cerveja Ronchi 600ml', 'price' => 24.00, 'is_active' => true, 'sort_order' => 5]);
    }
}
