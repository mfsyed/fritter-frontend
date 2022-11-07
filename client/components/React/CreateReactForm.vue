<!-- Form for creating freets (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'CreateReactForm',
  mixins: [BlockForm],
  data() {
    return {
      url: `/api/reacts/${freetId}`,
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'reaction', label: 'reaction', value: ''}
      ],
      title: 'Submit a reaction',
      refreshReacts: true,
      callback: () => {
        const message = 'Successfully reacted!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
