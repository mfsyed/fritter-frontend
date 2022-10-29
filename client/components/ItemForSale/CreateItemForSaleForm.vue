<!-- Form for creating items for sale (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'CreateItemForSaleForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/itemsforsale',
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'description', label: 'description', value: ''},
        {id: 'price', label: 'price', value: ''},
        {id: 'link', label: 'link', value: ''}
      ],
      title: 'Post an Item For Sale',
      refreshItemsForSale: true,
      callback: () => {
        const message = 'Successfully created an itemForSale';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
