<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="itemForSale"
  >
    <header>
      <h3 class="seller">
        @{{ itemForSale.seller }}
      </h3>
      <div
        v-if="$store.state.username === itemForSale.seller"
        class="actions"
      >
        <button
          v-if="editing"
          @click="submitEdit"
        >
          ✅ Save changes
        </button>
        <button
          v-if="editing"
          @click="stopEditing"
        >
          🚫 Discard changes
        </button>
        <button
          v-if="!editing"
          @click="startEditing"
        >
          ✏️ Edit
        </button>
        <button @click="deleteItemForSale">
          🗑️ Delete
        </button>
      </div>
    </header>
    <textarea
      v-if="editing"
      class="description"
      :value="draft"
      @input="draft = $event.target.value"
    />
    <p
      v-else
      class="description"
    >
      <a id="infolabel"> Description </a>
      <br> {{ itemForSale.description}}
    </p>
    <p
      class="price"
    > <a id="infolabel"> Price </a> <br>
      ${{ itemForSale.price}}
    </p>
    <p
      class="link"
    >
      <a id="infolabel"> Purchase through website: </a> <br>
      {{itemForSale.link}}
    </p>
    <p class="info">
      Posted at {{ itemForSale.dateModified }}
      <i v-if="itemForSale.edited">(edited)</i>
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
export default {
  name: 'ItemForSaleComponent',
  props: {
    // Data from the stored freet
    itemForSale: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      editing: false, // Whether or not this freet is in edit mode
      draft: this.itemForSale.description, // Potentially-new content for this freet
      alerts: {} // Displays success/error messages encountered during freet modification
    };
  },
  methods: {
    startEditing() {
      /**
       * Enables edit mode on this freet.
       */
      this.editing = true; // Keeps track of if a freet is being edited
      this.draft = this.itemForSale.description; // The content of our current "draft" while being edited
    },
    stopEditing() {
      /**
       * Disables edit mode on this freet.
       */
      this.editing = false;
      this.draft = this.itemForSale.description;
    },
    deleteItemForSale() {
      /**
       * Deletes this freet.
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted itemForSale!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    submitEdit() {
      /**
       * Updates freet to have the submitted draft content.
       */
      if (this.itemforSale.description === this.draft) {
        const error = 'Error: Edited freet content should be different than current freet content.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: 'PUT',
        message: 'Successfully edited freet!',
        body: JSON.stringify({content: this.draft}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
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
        const r = await fetch(`/api/itemsForSale/${this.itemForSale._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit('refreshItemsForSale');

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
    color: #10104f;
    width: 100%;
    border-radius: 20px;
    margin-bottom: 10px;
    background-color: #E6E6FA;
}

.description{
  background-color: #fbfbfe; 
  border-radius: 10px;
  padding: 1%;
}

.price, .link{
  padding: 1%;
}

#infolabel{
  color: 000;
  font-size: 25px;
}



.info {
  align-content: center;
  padding-left: 75%;
  font-size: 15px;
}
</style>
