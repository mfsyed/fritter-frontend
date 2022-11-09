<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->
<!--refresh shoppingCartTotal and stuff -->

<template>
  <article
    class="itemForSale"
  >
    <header>
      <h3 class="seller">
        @{{ itemForSale.seller }}
      </h3>
      <div
        class="actions"
      >
        <button @click="removeFromCart">
          Remove
        </button>
      </div>
    </header>

    <p class="description">
      {{ itemForSale.description}}
    </p>

    <p class="price">
      ${{ itemForSale.price }}
    </p>

    <hyperlink class="link">
      {{ itemForSale.link}}
    </hyperlink>

    <p class="quantity">
        QTY {{shoppingCart.items.get(itemForSale._id.toString())}}
    </p>

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

import ShoppingCartComponent from '@/components/ShoppingCart/ShoppingCartPage.vue';
export default {
  name: 'ItemForSaleInCart',
  props: {
    itemForSale: {
      type: Object,
      required: true
    },
    shoppingCart: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
 
      alerts: {} // Displays success/error messages encountered during freet modification
    };
  },
  methods: {
    removeFromCart() {
      /**
       * Deletes this freet.
       */
      const params = {
        method: 'PUT',
        body: JSON.stringify({cartIdRemoveFrom: shoppingCart._id}),
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted itemForSale from cart!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    async request(params) {
      /**
       * Submits a request to the freet's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      } 

      try {
        const r = await fetch(`/api/shoppingCart/${this.itemForSale._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.$store.commit('refreshShoppingCart');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style scoped>
.itemForSale {
    border: 1px solid #111;
    padding: 20px;
    position: relative;
}
</style>
