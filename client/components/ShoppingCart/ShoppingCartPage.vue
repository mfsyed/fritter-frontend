<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="shoppingCart"
  >
    <header>
      <h3 class="cartOwner">
        @{{ shoppingCart.cartOwner }}
      </h3>

      <section
        v-if="$store.state.itemsInCart.length"
      >
        <ItemForSaleInCart
          v-for="itemForSale in $store.state.itemsInCart"
          :key="itemForSale.id"
          :itemForSale="itemForSale"
        />
      </section>

    </header>


    <h3 class="total">
        @{{ shoppingCart.total }}
    </h3>


    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </article>
</template>

<script>
//import Comment Component
import ItemForSaleInCart from '@/components/ItemForSale/ItemForSaleInCart.vue';
export default {
  name: 'ShoppingCart',
  components: {ItemForSaleInCart},
  // mounted() {
  //   this.$refs.ItemForSaleInCart.submit();
  // },
  props: {
    shopingCart: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      alerts: {} // Displays success/error messages encountered during freet modification
    };
  },
  // methods: {

  //   submitEdit() {
  //     /**
  //      * Updates freet to have the submitted draft content.
  //      */
  //     if (this.freet.content === this.draft) {
  //       const error = 'Error: Edited freet content should be different than current freet content.';
  //       this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
  //       setTimeout(() => this.$delete(this.alerts, error), 3000);
  //       return;
  //     }

  //     const params = {
  //       method: 'PATCH',
  //       message: 'Successfully edited freet!',
  //       body: JSON.stringify({content: this.draft}),
  //       callback: () => {
  //         this.$set(this.alerts, params.message, 'success');
  //         setTimeout(() => this.$delete(this.alerts, params.message), 3000);
  //       }
  //     };
  //     this.request(params);
  //   },
  //   async request(params) {
  //     /**
  //      * Submits a request to the freet's endpoint
  //      * @param params - Options for the request
  //      * @param params.body - Body for the request, if it exists
  //      * @param params.callback - Function to run if the the request succeeds
  //      */
  //     const options = {
  //       method: params.method, headers: {'Content-Type': 'application/json'}
  //     };
  //     if (params.body) {
  //       options.body = params.body;
  //     }

  //     try {
  //       const r = await fetch(`/api/freets/${this.freet._id}`, options);
  //       if (!r.ok) {
  //         const res = await r.json();
  //         throw new Error(res.error);
  //       }

  //       this.editing = false;
  //       this.$store.commit('refreshFreets');

  //       params.callback();
  //     } catch (e) {
  //       this.$set(this.alerts, e, 'error');
  //       setTimeout(() => this.$delete(this.alerts, e), 3000);
  //     }
  //   }
  // }
};
</script>

<style scoped>
.freet {
    border: 1px solid #111;
    padding: 20px;
    position: relative;
}
</style>
