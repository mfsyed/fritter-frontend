<!-- Form for getting freets (all, from user) (inline style) -->

<script>

export default {
  name: 'GetItemsInCart',
  methods: {

    async submit() {
      //get cart
      //if cart doesn't exist, createcart
      const url = `/api/shoppingCart?cartOwner=${$store.state.username}`;
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }

      } catch (e) {

        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>
