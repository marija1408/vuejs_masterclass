<template>
  <div>
    <form @submit.prevent="save">
      <div class="form-group">
        <textarea
          name="inputText"
          id="inputText"
          cols="30"
          rows="10"
          class="form-input"
          v-model="text"
        ></textarea>
      </div>
      <div class="form-actions">
        <button v-if="isUpdate" @click.prevent="cancel" class="btn btn-ghost">Cancel</button>
        <button class="btn-blue">{{isUpdate ? 'Update post' : 'Submit post'}}</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
    props: {
        threadId: {
            required: false
        },
        post: {
          type: Object,
          validator: obj => {
            const keyIsValid = typeof obj['.key'] === 'string'
            const textIsValid = typeof obj.text === 'string'
            const validProps = keyIsValid && textIsValid

            if (!keyIsValid) {
              console.error('The post prop object must include a `.key` attribute!')
            }

            if (!textIsValid) {
              console.error('The post prop object must include a `text` attribute!')
            }
            
            return validProps;
          }
        }
    },
  data() {
    return {
      text: this. post ? this.post.text : ''
    };
  },
  computed: {
    isUpdate() {
      return !!this.post;
    }
  },
  methods: {
    create() {
      const post = {
        text: this.text,
        threadId: this.threadId
      };

      // Clear textarea after submit
      this.text = "";

      this.$emit('save', {post});

      return this.$store.dispatch('createPost', post);
    },
    update() {
      const payload = {
        id: this.post['.key'],
        text: this.text
      };

      return this.$store.dispatch('updatePost', payload);
    },
    save() {
      this.persist().then(post => {
        // Custom event -->Shorthand for passing object that contains same key and value name: {param1: param1} => {param1}
        this.$emit('save', {post});
      });
    },
    cancel() {
      this.$emit('cancel');
    },
    persist() {
      return (this.isUpdate ? this.update() : this.create())
    }
  }
};
</script>