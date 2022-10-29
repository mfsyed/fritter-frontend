<!-- Default page that also displays ItemForSales -->

<template>
  <main>
    <section v-if="$store.state.username">
      <header>
        <h2>Welcome @{{ $store.state.username }}</h2>
      </header>
      <GetItemsForSaleForm />
    </section>
    <section v-else>
      <header>
        <h2>Welcome to Fritter!</h2>
      </header>
      <article>
        <h3>
          <router-link to="/login">
            Sign in
          </router-link>
          to create, edit, and delete items for sale.
        </h3>
      </article>
    </section>
    <section>
      <header>
        <div class="left">
          <h2>
            Viewing all Items For Sale
            <span v-if="$store.state.filter">
              by @{{ $store.state.filter }}
            </span>
          </h2>
        </div>
        <div class="right">
          <GetItemsForSaleForm
            ref="getItemsForSaleForm"
            value="seller"
            placeholder="🔍 Filter by seller (optional)"
            button="🔄 Get ItemForSales"
          />
        </div>
      </header>
      <section
        v-if="$store.state.itemsForSale.length"
      >
        <ItemForSaleComponent
          v-for="itemForSale in $store.state.itemsForSale"
          :key="itemForSale.id"
          :itemForSale="itemForSale"
        />
      </section>
      <article
        v-else
      >
        <h3>No items for sale found.</h3>
      </article>
    </section>
  </main>
</template>

<script>
import ItemForSaleComponent from '@/components/ItemForSale/ItemForSaleComponent.vue';
import CreateItemForSaleForm from '@/components/ItemForSale/CreateItemForSaleForm.vue';
import GetItemsForSaleForm from '@/components/ItemForSale/GetItemsForSaleForm.vue';

export default {
  name: 'ItemsForSalePage',
  components: {ItemForSaleComponent, GetItemsForSaleForm, CreateItemForSaleForm},
  mounted() {
    this.$refs.GetItemsForSaleForm.submit();
  }
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
}

header, header > * {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

button {
    margin-right: 10px;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}
</style>
